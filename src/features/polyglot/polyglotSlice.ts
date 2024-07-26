import { RootState } from "../../app/store";
import { createSlice } from "@reduxjs/toolkit";
import content from '../../content.json';

const defaultLanguage = navigator.language;

const isValidLanguage = (lang: string): lang is keyof typeof content => {
    return content.hasOwnProperty(lang);
};

const languageToUse = isValidLanguage(defaultLanguage) ? defaultLanguage : 'pt-BR';
interface PolyglotState {
    locale: string;
    phrases: { default: any;[key: string]: any };
}

const initialState: PolyglotState = {
    locale: languageToUse,
    phrases: { default: content[languageToUse], ...content }
};

const polyglotSlice = createSlice({
    name: 'polyglot',
    initialState: initialState,
    reducers: {
        setLocale(state, action) {
            state.locale = action.payload;
        }
    },
});

export const selectLocale = (state: RootState) => state.polyglot.locale;
export const selectPhrases = (state: RootState) => state.polyglot.phrases;


export const { setLocale } = polyglotSlice.actions;
export default polyglotSlice.reducer;
