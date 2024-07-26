import Polyglot from 'node-polyglot';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectLocale, selectPhrases } from './polyglotSlice';

interface TranslateFunction {
  (key: string, ...args: any[]): string;
}

interface UseTranslate {
  (prefix: string): TranslateFunction;
}

const useTranslate: UseTranslate = (prefix) => {
  const locale = useSelector(selectLocale);
  const phrases = useSelector(selectPhrases);

  const translate = useMemo(() => {
    const p = new Polyglot({ phrases: phrases[locale] || phrases.default || {} });

    return (key: string, ...args: any[]): string => p.t(key, ...args);
  }, [phrases, locale]);

  const t = useMemo(
    () => (key: string, ...args: any[]): string => translate([prefix, key].filter((s) => s).join('.'), ...args),
    [prefix, translate]
  );

  return t;
};

export default useTranslate;
