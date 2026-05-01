import { format } from 'date-fns';
import { ChangeEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import CommonDialog from '@components/_common/alert-dialog/common-dialog/CommonDialog';
import ProfileImage from '@components/_common/profile-image/ProfileImage';
import ValidatedInput from '@components/_common/validated-input/ValidatedInput';
import {
  PRIVACY_POLICY_AND_RESEARCH_CONSENT_FORM_NOTION_URL_EN,
  PRIVACY_POLICY_AND_RESEARCH_CONSENT_FORM_NOTION_URL_KO,
} from '@constants/url';
import { Button, CheckBox, Layout, SvgIcon, Typo } from '@design-system';
import { usePostAppMessage } from '@hooks/useAppMessage';
import { UserGroup, VersionType } from '@models/api/user';
import { UserProfile } from '@models/user';
import { useBoundStore } from '@stores/useBoundStore';
import { searchUser, validateBirthdate, validateInviterUsername } from '@utils/apis/user';
import { AUTH_BUTTON_WIDTH } from 'src/design-system/Button/Button.types';

const SEARCH_DEBOUNCE_MS = 300;
const MAX_DROPDOWN_RESULTS = 5;

interface SelectedFriend {
  username: string;
  inviter_id: number;
  current_ver: VersionType;
  user_group: UserGroup;
}

function Info() {
  const [t, i18n] = useTranslation('translation', { keyPrefix: 'sign_up' });
  const [dateOfBirthInput, setDateOfBirthInput] = useState('');
  const [dateOfBirthError, setDateOfBirthError] = useState<string | null>(null);
  const [friendUsernameInput, setFriendUsernameInput] = useState('');
  const [friendUsernameError, setFriendUsernameError] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<UserProfile[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState<SelectedFriend | null>(null);
  const [privacyPolicyChecked, setPrivacyPolicyChecked] = useState(false);
  const [showAgeConfirmDialog, setShowAgeConfirmDialog] = useState(false);
  const [calculatedAge, setCalculatedAge] = useState(0);
  const { openToast, setSignUpInfo } = useBoundStore((state) => ({
    openToast: state.openToast,
    setSignUpInfo: state.setSignUpInfo,
  }));
  const navigate = useNavigate();
  const postMessage = usePostAppMessage();

  const privacyPolicyLink =
    i18n.language === 'ko-KR'
      ? PRIVACY_POLICY_AND_RESEARCH_CONSENT_FORM_NOTION_URL_KO
      : PRIVACY_POLICY_AND_RESEARCH_CONSENT_FORM_NOTION_URL_EN;

  const isValideDateOfBirth = (date: string) => {
    const dateObj = new Date(date);
    return dateObj instanceof Date && !Number.isNaN(dateObj.getTime());
  };

  const handleChangeDateOfBirth = (e: ChangeEvent<HTMLInputElement>) => {
    setDateOfBirthInput(e.target.value);
    if (dateOfBirthError) setDateOfBirthError(null);
  };

  const handleChangeFriendUsername = (e: ChangeEvent<HTMLInputElement>) => {
    setFriendUsernameInput(e.target.value);
    if (friendUsernameError) setFriendUsernameError(null);
    if (selectedFriend) setSelectedFriend(null);
  };

  // Debounced user search — show dropdown of matching profiles
  useEffect(() => {
    if (selectedFriend) return undefined;
    const trimmed = friendUsernameInput.trim();
    if (!trimmed) {
      setSearchResults([]);
      setIsSearching(false);
      return undefined;
    }
    setIsSearching(true);
    const handle = window.setTimeout(async () => {
      try {
        const { results = [] } = await searchUser(trimmed);
        setSearchResults(results.slice(0, MAX_DROPDOWN_RESULTS));
      } catch {
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, SEARCH_DEBOUNCE_MS);
    return () => window.clearTimeout(handle);
  }, [friendUsernameInput, selectedFriend]);

  const handleSelectFriend = (user: UserProfile) => {
    validateInviterUsername({
      username: user.username,
      onSuccess: (res) => {
        setSelectedFriend({
          username: user.username,
          inviter_id: res.inviter_id,
          current_ver: res.current_ver,
          user_group: res.user_group,
        });
        setFriendUsernameInput(user.username);
        setSearchResults([]);
        setFriendUsernameError(null);
      },
      onError: () => {
        setFriendUsernameError(t('friend_username_error'));
      },
    });
  };

  const handleClearSelection = () => {
    setSelectedFriend(null);
    setFriendUsernameInput('');
  };

  const calculateAge = (birthDate: string) => {
    const birthDateObj = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birthDateObj.getFullYear();
    const monthDiff = today.getMonth() - birthDateObj.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDateObj.getDate())) {
      age -= 1;
    }

    return age;
  };

  const onClickNext = () => {
    if (!isValideDateOfBirth(dateOfBirthInput)) {
      setDateOfBirthError(t('date_of_birth_error'));
      return;
    }

    const proceedToAgeConfirm = () => {
      const age = calculateAge(dateOfBirthInput);
      setCalculatedAge(age);
      setShowAgeConfirmDialog(true);
    };

    if (selectedFriend) {
      setSignUpInfo({
        inviter_id: selectedFriend.inviter_id,
        current_ver: selectedFriend.current_ver,
        user_group: selectedFriend.user_group,
      });
      proceedToAgeConfirm();
    } else if (friendUsernameInput.trim()) {
      // Has text but no profile clicked — block to prevent typo-mismatch
      setFriendUsernameError(t('must_click_profile'));
    } else {
      setSignUpInfo({ inviter_id: 0 });
      proceedToAgeConfirm();
    }
  };

  const handleConfirmAge = () => {
    // Convert to YYYY-MM-DD format
    const birthdate = format(new Date(dateOfBirthInput), 'yyyy-MM-dd');

    validateBirthdate({
      birthdate,
      onSuccess: () => {
        navigate('/signup/password');
      },
      onError: (errorMsg: string) => {
        openToast({
          message: errorMsg,
        });
      },
    });

    setShowAgeConfirmDialog(false);
  };

  const handleClickPrivacyPolicy = () => {
    if (window.ReactNativeWebView) {
      postMessage('OPEN_BROWSER', {
        url: privacyPolicyLink,
      });
    } else {
      window.open(privacyPolicyLink, '_blank');
    }
  };

  const hasUnselectedQuery = !selectedFriend && !!friendUsernameInput.trim();
  const nextDisabled =
    !dateOfBirthInput ||
    !!dateOfBirthError ||
    !privacyPolicyChecked ||
    !!friendUsernameError ||
    hasUnselectedQuery;

  return (
    <>
      <Layout.FlexCol gap={20} w="100%">
        <Layout.FlexCol w="100%" style={{ position: 'relative' }}>
          <ValidatedInput
            label={t('friend_username')}
            name="friend_username"
            type="text"
            value={friendUsernameInput}
            onChange={handleChangeFriendUsername}
            error={friendUsernameError}
            guide={selectedFriend ? undefined : t('friend_username_guide')}
            disabled={!!selectedFriend}
          />
          {selectedFriend && (
            <ClearButton type="button" onClick={handleClearSelection}>
              <SvgIcon name="close" size={16} color="DARK_GRAY" />
            </ClearButton>
          )}
          {!selectedFriend && friendUsernameInput.trim().length > 0 && searchResults.length > 0 && (
            <Dropdown>
              {searchResults.map((user) => (
                <DropdownRow key={user.id} type="button" onClick={() => handleSelectFriend(user)}>
                  <ProfileImage imageUrl={user.profile_image} username={user.username} size={32} />
                  <Typo type="body-medium" color="BLACK">
                    {user.username}
                  </Typo>
                </DropdownRow>
              ))}
            </Dropdown>
          )}
          {!selectedFriend &&
            !isSearching &&
            friendUsernameInput.trim().length > 0 &&
            searchResults.length === 0 && (
              <Typo type="label-medium" color="MEDIUM_GRAY">
                {t('no_search_results')}
              </Typo>
            )}
        </Layout.FlexCol>
        <ValidatedInput
          label={t('date_of_birth')}
          name="date_of_birth"
          type="date"
          value={dateOfBirthInput}
          onChange={handleChangeDateOfBirth}
          error={dateOfBirthError}
          guide={t('date_of_birth_guide')}
        />
        {/* Privacy related checks */}
        <Layout.FlexCol gap={10}>
          <Typo type="title-medium" color="MEDIUM_GRAY">
            {t('privacy_policy')}
          </Typo>
          <Typo type="label-medium" color="BLACK">
            {t('privacy_policy_guide')}
          </Typo>
          <a
            href={privacyPolicyLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              e.preventDefault();
              handleClickPrivacyPolicy();
            }}
          >
            <Typo type="label-medium" color="BLACK">
              📄{' '}
            </Typo>
            <Typo type="label-medium" color="BLACK" underline>
              {t('privacy_policy_link_view')}
            </Typo>
          </a>
          <Layout.FlexRow alignItems="center" gap={4} mt={10}>
            <CheckBox
              checked={privacyPolicyChecked}
              onChange={(e) => setPrivacyPolicyChecked(e.target.checked)}
            />
            <Typo type="label-large">{t('privacy_policy_agree')}</Typo>
          </Layout.FlexRow>
        </Layout.FlexCol>
      </Layout.FlexCol>

      <Layout.Fixed l={0} b={30} w="100%" alignItems="center">
        <Button.Large
          type="gray_fill"
          status={nextDisabled ? 'disabled' : 'normal'}
          width={AUTH_BUTTON_WIDTH}
          text={t('next')}
          onClick={onClickNext}
        />
      </Layout.Fixed>
      <CommonDialog
        visible={showAgeConfirmDialog}
        title={t('age_confirm_dialog_title')}
        content={t('age_confirm_dialog_content', { age: calculatedAge })}
        confirmText={t('age_confirm_dialog_yes')}
        cancelText={t('age_confirm_dialog_no')}
        onClickConfirm={handleConfirmAge}
        onClickClose={() => setShowAgeConfirmDialog(false)}
      />
    </>
  );
}

const Dropdown = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-top: 4px;
  border: 1px solid ${({ theme }) => theme.LIGHT_GRAY};
  border-radius: 8px;
  background: ${({ theme }) => theme.WHITE};
  overflow: hidden;
`;

const DropdownRow = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 10px 12px;
  background: transparent;
  border: none;
  border-bottom: 1px solid ${({ theme }) => theme.LIGHT};
  text-align: left;
  cursor: pointer;
  &:last-child {
    border-bottom: none;
  }
  &:hover {
    background: ${({ theme }) => theme.LIGHT};
  }
`;

const ClearButton = styled.button`
  position: absolute;
  right: 4px;
  top: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  padding: 4px;
  cursor: pointer;
`;

export default Info;
