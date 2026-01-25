import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { Layout, Typo } from '@design-system';
import * as S from './HashtagSelectInput.styled';

interface HashtagSelectInputProps {
  label: string;
  value: string[]; // 선택된 해시태그 배열
  options: string[]; // 검색 결과 옵션들
  selectedOptions?: string[]; // 선택된 항목들
  isLoading?: boolean;
  onChange: (selectedLabels: string[]) => void;
  onSearch: (query: string) => void;
  placeholder?: string;
}

function HashtagSelectInput({
  label,
  value,
  options,
  selectedOptions: providedSelectedOptions,
  isLoading = false,
  onChange,
  onSearch,
  placeholder,
}: HashtagSelectInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 선택된 옵션들을 가져오기
  // providedSelectedOptions가 있으면 사용하고, 없으면 options에서 필터링
  const selectedOptions =
    providedSelectedOptions && providedSelectedOptions.length > 0
      ? providedSelectedOptions.filter((opt) => value.includes(opt))
      : options.filter((opt) => value.includes(opt));

  // 검색어가 변경되면 검색 실행
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onSearch(inputValue);
    }, 300); // 디바운스

    return () => clearTimeout(timeoutId);
  }, [inputValue, onSearch]);

  // 포커스 시 드롭다운 표시
  useEffect(() => {
    if (isFocused) {
      setShowDropdown(true);
      // 입력값이 없으면 전체 목록을 위해 빈 문자열로 검색
      if (!inputValue) {
        onSearch('');
      }
    }
  }, [isFocused, inputValue, onSearch]);

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setShowDropdown(true);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (inputValue.length > 0) {
        // 글자 있음 → 기본 동작(한 글자 삭제)에 맡김
        return;
      }
      if (value.length > 0) {
        // 글자 없고 태그만 있을 때: 마지막 태그 삭제
        e.preventDefault();
        onChange(value.slice(0, -1));
      }
      return;
    }

    if (e.key === 'Enter' || e.key === ',' || e.key === ' ') {
      e.preventDefault();
      const trimmedValue = inputValue.replace(/^#+/, '').trim();
      if (trimmedValue.length > 0) {
        // 커스텀 해시태그 추가
        const customTagLabel = trimmedValue.toLowerCase();
        if (!value.includes(customTagLabel)) {
          onChange([...value, customTagLabel]);
        }
        setInputValue('');
        // 입력 필드 초기화 후에도 드롭다운 유지 및 전체 목록 검색
        setShowDropdown(true);
        onSearch('');
      }
    }
  };

  const handleInputFocus = () => {
    setIsFocused(true);
    setShowDropdown(true);
  };

  const handleInputBlur = () => {
    // 드롭다운 항목 탭 시 handleSelectOption이 input에 다시 focus함 → 그 경우 닫지 않음
    // iOS 키보드 '완료'(체크) 등으로 blur된 경우에만 드롭다운 닫기
    setTimeout(() => {
      if (document.activeElement !== inputRef.current) {
        setIsFocused(false);
        setShowDropdown(false);
      }
    }, 200);
  };

  const handleSelectOption = (option: string) => {
    if (value.includes(option)) {
      // 이미 선택된 경우 제거
      onChange(value.filter((val) => val !== option));
    } else {
      // 선택 추가
      onChange([...value, option]);
    }
    // 입력 필드 초기화하고 포커스 유지
    setInputValue('');
    inputRef.current?.focus();
  };

  const handleRemoveTag = (labelToRemove: string) => {
    onChange(value.filter((val) => val !== labelToRemove));
  };

  const hasSelectedTags = selectedOptions.length > 0;

  return (
    <S.HashtagSelectInputContainer>
      <Typo type="title-medium" color={isFocused ? 'BLACK' : 'MEDIUM_GRAY'}>
        {label}
      </Typo>
      <S.InputWrapper ref={containerRef}>
        <S.TagsContainer hasSelectedTags={hasSelectedTags}>
          {selectedOptions.map((option) => (
            <S.TagWrapper key={option}>
              <S.SelectedTag onClick={() => handleRemoveTag(option)}>
                <Typo type="body-medium" color="BLACK">
                  {option.startsWith('#') ? option : `#${option}`}
                </Typo>
              </S.SelectedTag>
            </S.TagWrapper>
          ))}
          <S.InputContainer hasSelectedTags={hasSelectedTags}>
            <S.StyledInput
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleInputKeyDown}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              placeholder={hasSelectedTags ? '' : placeholder}
              autoComplete="off"
              hasSelectedTags={hasSelectedTags}
            />
          </S.InputContainer>
        </S.TagsContainer>
      </S.InputWrapper>

      {showDropdown && (inputValue || options.length > 0) && (
        <S.DropdownContainer ref={dropdownRef} data-hashtag-dropdown="">
          {isLoading && options.length === 0 ? (
            <S.DropdownItem>
              <Typo type="body-medium" color="MEDIUM_GRAY">
                Loading...
              </Typo>
            </S.DropdownItem>
          ) : options.length > 0 ? (
            options.map((option) => {
              const isSelected = value.includes(option);
              return (
                <S.DropdownItem
                  key={option}
                  onClick={() => handleSelectOption(option)}
                  isSelected={isSelected}
                >
                  <Layout.FlexRow gap={8} alignItems="center">
                    <Typo type="body-medium" color="BLACK" bold={isSelected}>
                      {option.startsWith('#') ? option : `#${option}`}
                    </Typo>
                  </Layout.FlexRow>
                </S.DropdownItem>
              );
            })
          ) : (
            <S.DropdownItem>
              <Typo type="body-medium" color="MEDIUM_GRAY">
                No results found
              </Typo>
            </S.DropdownItem>
          )}
        </S.DropdownContainer>
      )}
    </S.HashtagSelectInputContainer>
  );
}

export default HashtagSelectInput;
