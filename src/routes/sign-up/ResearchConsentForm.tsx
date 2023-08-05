import format from 'date-fns/format';
import { ChangeEvent, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import ValidatedInput from '@components/_common/validated-input/ValidatedInput';
import { Button, CheckBox, CommonInput, Font, Layout } from '@design-system';
import { Gender } from '@models/api/user';
import { useBoundStore } from '@stores/useBoundStore';
import { AUTH_BUTTON_WIDTH } from 'src/design-system/Button/Button.types';

const NEED_PARENTAL_PERMISSION_AGE = 18;
const today = format(new Date(), 'yyyy-MM-dd');

function ResearchConsentForm() {
  const [t] = useTranslation('translation', { keyPrefix: 'sign_up' });

  const [ageInput, setAgeInput] = useState<string>('');
  const [gender, setGender] = useState<Gender>();
  const [signature, setSignature] = useState('');

  const showParentalPermissionRef = useRef(false);
  const [parentalPermission, setParentalPermission] = useState<boolean | undefined>();

  const setSignUpInfo = useBoundStore((state) => state.setSignUpInfo);

  const handleChangeAge = (e: ChangeEvent<HTMLInputElement>) => {
    setAgeInput((v) => (e.target.validity.valid ? e.target.value : v));
    setParentalPermission(undefined);

    if (e.target.value && Number(e.target.value) < NEED_PARENTAL_PERMISSION_AGE) {
      showParentalPermissionRef.current = true;
      return;
    }

    showParentalPermissionRef.current = false;
  };

  const handleChangeParentalPermission = (permission: boolean) => () => {
    setParentalPermission(permission);
  };

  const handleChangeGender = (genderInput: Gender) => () => {
    setGender((prev) => (prev === genderInput ? undefined : genderInput));
  };

  const handleChangeSign = (e: ChangeEvent<HTMLInputElement>) => {
    setSignature(e.target.value);
  };

  const navigate = useNavigate();
  const handleClickNext = () => {
    setSignUpInfo({
      research_agreement: true,
      age: Number(ageInput),
      gender,
      signature,
      date_of_signature: today,
    });
    navigate('/signup/username');
  };

  const canSubmit =
    ageInput &&
    gender !== undefined &&
    signature &&
    (!showParentalPermissionRef.current ||
      (showParentalPermissionRef.current && parentalPermission));

  return (
    <>
      {/* Age */}
      <ValidatedInput
        label={t('age')}
        inputMode="numeric"
        pattern="[0-9]*"
        name="age"
        value={ageInput}
        onChange={handleChangeAge}
      />
      {/* Parental Permission */}
      {showParentalPermissionRef.current && (
        <Layout.LayoutBase mb={45} gap={12}>
          <Font.Body type="18_regular">{t('parental_permission')}</Font.Body>
          <Font.Body type="14_regular" mb={24}>
            {t('i_agree_to_provide_consent_to_my_child’s_participation_in_the_research')}
          </Font.Body>
          <CheckBox
            name={t('yes') || ''}
            onChange={handleChangeParentalPermission(true)}
            checked={parentalPermission === true}
          />
          <CheckBox
            name={t('no') || ''}
            onChange={handleChangeParentalPermission(false)}
            checked={parentalPermission === false}
          />
          {parentalPermission === false && (
            <Font.Body type="12_regular" color="ERROR">
              {t('need_parental_permission_error')}
            </Font.Body>
          )}
        </Layout.LayoutBase>
      )}
      {/* Gender */}
      <Layout.LayoutBase mb={45} gap={12} w="100%">
        <Font.Body type="18_regular" mb={24}>
          {t('gender')}
        </Font.Body>
        <CheckBox
          name={t('female') || ''}
          onChange={handleChangeGender(Gender.FEMALE)}
          checked={gender === Gender.FEMALE}
        />
        <CheckBox
          name={t('male') || ''}
          onChange={handleChangeGender(Gender.MALE)}
          checked={gender === Gender.MALE}
        />
        <CheckBox
          name={t('transgender') || ''}
          onChange={handleChangeGender(Gender.TRANSGENDER)}
          checked={gender === Gender.TRANSGENDER}
        />
        <CheckBox
          name={t('non_binary') || ''}
          onChange={handleChangeGender(Gender.NON_BINARY)}
          checked={gender === Gender.NON_BINARY}
        />
        <CheckBox
          name={t('dont_want_to_respond') || ''}
          onChange={handleChangeGender(Gender.NO_RESPOND)}
          checked={gender === Gender.NO_RESPOND}
        />
      </Layout.LayoutBase>
      {/* Signature */}
      <Layout.LayoutBase mb={45}>
        <Font.Body type="18_regular" mb={24}>
          {t('printing_your_name_below')}
        </Font.Body>
        <CommonInput type="name" value={signature} onChange={handleChangeSign} />
      </Layout.LayoutBase>
      {/* Date of Signature */}
      <ValidatedInput
        type="date"
        value={today}
        name="date_of_signature"
        label={t('date_of_signature')}
        disabled
      />
      <Layout.LayoutBase mb={112}>
        <Font.Display type="14_regular">{t('data_security_guide')}</Font.Display>
      </Layout.LayoutBase>
      <Layout.FlexCol w="100%" alignItems="center" mb={80}>
        <Button.Large
          type="gray_fill"
          status={canSubmit ? 'normal' : 'disabled'}
          width={AUTH_BUTTON_WIDTH}
          text={t('next')}
          onClick={handleClickNext}
        />
      </Layout.FlexCol>
    </>
  );
}

export default ResearchConsentForm;
