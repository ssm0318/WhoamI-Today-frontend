import { format } from 'date-fns';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import SearchInput from '@components/_common/search-input/SearchInput';
import SubHeader from '@components/sub-header/SubHeader';
import { Layout, Typo } from '@design-system';
import { ChatMessage } from '@models/chat';
import { searchMessages } from '@utils/apis/chat';
import { MainScrollContainer } from '../Root';

function HighlightedText({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <span>{text}</span>;

  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, i) => {
        const key = `${part}-${i}`;
        return regex.test(part) ? (
          <span key={key} style={{ backgroundColor: '#F3E8FF', fontWeight: 600 }}>
            {part}
          </span>
        ) : (
          <React.Fragment key={key}>{part}</React.Fragment>
        );
      })}
    </>
  );
}

interface SearchResult extends ChatMessage {
  opponent?: { id: number; username: string };
}

function ChatSearch() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const CACHE_KEY = 'chat_search_cache';
  const initialQuery = searchParams.get('q') || '';

  // Restore cached results on mount (back button case)
  const cachedData = useRef(() => {
    try {
      const raw = sessionStorage.getItem(CACHE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.query === initialQuery && initialQuery) return parsed;
      }
    } catch {
      /* ignore */
    }
    return null;
  });
  const cached = cachedData.current();

  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<SearchResult[]>(cached?.results || []);
  const [searched, setSearched] = useState(!!cached?.results?.length);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  // Sync query to URL params
  useEffect(() => {
    if (query.trim()) {
      setSearchParams({ q: query }, { replace: true });
    } else {
      setSearchParams({}, { replace: true });
    }
  }, [query, setSearchParams]);

  // Search when query changes (skip if we already have cached results for this query)
  const lastSearchedQuery = useRef(cached ? initialQuery : '');

  useEffect(() => {
    if (query === lastSearchedQuery.current) return;
    clearTimeout(debounceRef.current);
    if (query.trim().length < 2) {
      setResults([]);
      setSearched(false);
      lastSearchedQuery.current = '';
      return;
    }
    debounceRef.current = setTimeout(async () => {
      try {
        const data = await searchMessages(query.trim());
        const list = Array.isArray(data)
          ? data
          : (data as { results?: SearchResult[] }).results || [];
        setResults(list);
        setSearched(true);
        lastSearchedQuery.current = query;
        // Cache results for back button
        sessionStorage.setItem(CACHE_KEY, JSON.stringify({ query, results: list }));
      } catch {
        setResults([]);
        setSearched(true);
      }
    }, 300);
    return () => clearTimeout(debounceRef.current);
  }, [query]);

  const SCROLL_KEY = 'chat_search_scroll';

  // Restore scroll position after cached results render
  useLayoutEffect(() => {
    if (cached?.results?.length) {
      requestAnimationFrame(() => {
        const saved = sessionStorage.getItem(SCROLL_KEY);
        if (saved) {
          const el = document.getElementById('main-scroll-container');
          if (el) {
            el.scrollTop = Number(saved);
          }
        }
      });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleClickResult = (msg: SearchResult) => {
    const el = document.getElementById('main-scroll-container');
    if (el) {
      sessionStorage.setItem(SCROLL_KEY, String(el.scrollTop));
    }
    if (msg.opponent) {
      navigate(`/users/${msg.opponent.id}/chat`, {
        state: { scrollToMessageId: msg.id },
      });
    }
  };

  return (
    <MainScrollContainer>
      <SubHeader title="Search Messages" />
      <Layout.FlexCol w="100%" ph={16} pv={8}>
        <SearchInput query={query} setQuery={setQuery} placeholder="Search messages..." autoFocus />
      </Layout.FlexCol>
      {searched && results.length === 0 && (
        <Layout.FlexCol w="100%" alignItems="center" mt={30}>
          <Typo type="body-medium" color="MEDIUM_GRAY">
            No messages found.
          </Typo>
        </Layout.FlexCol>
      )}
      {results.map((msg) => (
        <Layout.FlexRow
          key={msg.id}
          w="100%"
          ph={16}
          pv={10}
          gap={10}
          cursor="pointer"
          onClick={() => handleClickResult(msg)}
          style={{ borderBottom: '1px solid #F0F0F0' }}
        >
          <Layout.FlexCol style={{ flex: 1, minWidth: 0 }}>
            <Layout.FlexRow gap={6} alignItems="center">
              <Typo type="title-small" color="BLACK">
                {msg.opponent?.username || msg.sender.username}
              </Typo>
              <Typo type="label-small" color="MEDIUM_GRAY">
                {format(new Date(msg.created_at), 'M/d/yy')}
              </Typo>
            </Layout.FlexRow>
            <Typo type="body-small" color="DARK_GRAY">
              <HighlightedText
                text={msg.content.length > 100 ? `${msg.content.slice(0, 100)}...` : msg.content}
                query={query}
              />
            </Typo>
          </Layout.FlexCol>
        </Layout.FlexRow>
      ))}
    </MainScrollContainer>
  );
}

export default ChatSearch;
