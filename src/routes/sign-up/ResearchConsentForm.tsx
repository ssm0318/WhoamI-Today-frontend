import format from 'date-fns/format';
import { ChangeEvent, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import ValidatedInput from '@components/_common/validated-input/ValidatedInput';
import { Button, Font } from '@design-system';
import { Gender } from '@models/api/user';
import { useBoundStore } from '@stores/useBoundStore';
import CheckBox from 'src/design-system/Inputs/CheckBox';
import CommonInput from 'src/design-system/Inputs/Input.styled';
import { LayoutBase } from 'src/design-system/layouts';

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
    <LayoutBase ml={24} mr={24}>
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
        <LayoutBase mb={45}>
          <Font.Body type="18_regular" mb={24}>
            {t('parental_permission')}
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
        </LayoutBase>
      )}
      {/* Gender */}
      <LayoutBase mb={45}>
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
      </LayoutBase>
      {/* Signature */}
      <LayoutBase mb={45}>
        <Font.Body type="18_regular" mb={24}>
          {t('printing_your_name_below')}
        </Font.Body>
        <CommonInput type="name" value={signature} onChange={handleChangeSign} />
      </LayoutBase>
      {/* Date of Signature */}
      <ValidatedInput
        type="date"
        value={today}
        name="date_of_signature"
        label={t('date_of_signature')}
        disabled
      />
      <LayoutBase mb={112}>
        <Font.Display type="14_regular">{t('data_security_guide')}</Font.Display>
      </LayoutBase>
      <Button.Large
        type="filled"
        status={canSubmit ? 'normal' : 'disabled'}
        sizing="stretch"
        text={t('next')}
        onClick={handleClickNext}
      />
    </LayoutBase>
  );
}

export default ResearchConsentForm;
