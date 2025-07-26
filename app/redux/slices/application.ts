import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const applicationSlice = createSlice({
    name: 'application',
    initialState: {
        theme: "dark",
        font: "",
        force_dark: "",
        language: 'en',
    },
    reducers: {
        onChangeTheme(state, action: PayloadAction<string>) {
            state.theme = action.payload;
        },
        onChangeFont(state, action: PayloadAction<string>) {
            state.font = action.payload;
        },
        onForceTheme(state, action: PayloadAction<string>) {
            state.force_dark = action.payload;
        },
        onChangeLanguage(state, action: PayloadAction<string>) {
            state.language = action.payload;
        },
       

    }
});
export const { onChangeTheme, onChangeFont,onForceTheme,onChangeLanguage } = applicationSlice.actions;
export default applicationSlice.reducer;




 



