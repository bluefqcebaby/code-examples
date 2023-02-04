import { FilterValue } from 'src/types/marketplace/status';
import { IViewCompany } from './../../types/marketplace/IViewCompany';
import { ICompany } from './../../types/marketplace/ICompany';
import { setNotification } from 'src/store/slices/appSlice';
import { RootState } from './../index';
import { IField } from './../../types/common/IField';
import { IReview } from './../../types/marketplace/IReview';
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { ISpeaker } from 'src/types/marketplace/ISpeaker';
import { CreateCompanyTabs } from 'src/types/marketplace/tabs';
import { format } from 'date-fns';
import { tryCatch } from 'src/helpers/tryCatch';
import markeplaceService from 'src/api/markerplace-service';

interface IState {
  activeCreateCompanyTab: CreateCompanyTabs;
  createCompanyForm: {
    canSubmit: boolean;
    title: IField<string>;
    description: IField<string>;
    logo: IField<File | null>;
    speakers: ISpeaker[];
    reviews: IReview[];
  };
  selectedFilter: FilterValue;
  searchValue: string;
  companies: IViewCompany[];
}

const initSpeaker: ISpeaker = { name: '', position: '', photo: null, id: 0 };
const initReview: IReview = {
  id: 0,
  comment: '',
  date: new Date(),
  name: '',
  rating: 1,
};

const initialState: IState = {
  activeCreateCompanyTab: 'description',
  createCompanyForm: {
    canSubmit: false,
    title: {
      value: '',
      error: '',
    },
    description: {
      value: '',
      error: '',
    },
    logo: {
      value: null,
      error: '',
    },
    speakers: [initSpeaker],
    reviews: [initReview],
  },
  selectedFilter: 'all',
  searchValue: '',
  companies: [],
};

export const fetchAllCompanies = createAsyncThunk(
  'markeplace/fetchAllCompanies',
  async (_, { rejectWithValue }) => {
    const [data, err] = await tryCatch<{
      companies: IViewCompany[];
      companiesCount: number;
    }>(markeplaceService.getAllCompanies());
    if (err) {
      throw rejectWithValue(`ERROR in fetchAllCompanies >>> ${err.message}`);
    }
    return data;
  }
);

export const submitCompany = createAsyncThunk(
  'marketplace/submitCompany',
  async (isDraft: boolean, { rejectWithValue, getState, dispatch }) => {
    const {
      marketplace: { createCompanyForm },
    } = getState() as RootState;
    const formData = new FormData();
    formData.append('title', createCompanyForm.title.value);
    formData.append('description', createCompanyForm.description.value);
    formData.append('logo', createCompanyForm.logo.value);
    formData.append('publicationStatusId', isDraft ? '1' : '3');

    const [company, companyErr] = await tryCatch<ICompany>(
      markeplaceService.createCompany(formData)
    );

    if (companyErr) {
      dispatch(
        setNotification({
          value: `Ошибка при ${
            isDraft ? 'сохранении черновика' : 'создания компании'
          } [${companyErr.message}]`,
          variant: 'error',
        })
      );
    }

    createCompanyForm.speakers.forEach(async (elem, index) => {
      const speakerFormData = new FormData();
      if (!elem.name || !elem.position || !elem.position) {
        return;
      }
      speakerFormData.append('name', elem.name.split(' ')[0] ?? '');
      speakerFormData.append('surname', elem.name.split(' ')[1] ?? '');
      elem.photo && speakerFormData.append('avatar', elem.photo);
      elem.position && speakerFormData.append('positionAtWork', elem.position);
      speakerFormData.append('order', index + '');
      const [, speakerErr] = await tryCatch(
        markeplaceService.addSpeaker(speakerFormData, company.id)
      );
      if (speakerErr) {
        dispatch(
          setNotification({
            value: `Ошибка при добавлении спикера ${speakerErr.message}`,
            variant: 'error',
          })
        );
      }
    });

    const apiRatings = createCompanyForm.reviews
      .map((elem) => ({
        rate: elem.rating,
        comment: elem.comment,
        name: elem.name,
        createdAt: format(elem.date, 'yyyy-MM-dd'),
      }))
      .filter((elem) => elem.comment.trim() !== '');

    // const [, ratingsErr] = await tryCatch(
    //   markeplaceService.addRatings(apiRatings, company.id)
    // );

    // if (ratingsErr) {
    //   dispatch(
    //     setNotification({
    //       value: `Ошибка при добавлении отзывов ${ratingsErr.message}`,
    //     })
    //   );
    // }

    return true;
  }
);

export interface ChangeSpeakers {
  key: keyof ISpeaker;
  index: number;
  value: File | string | null;
}

export interface ChangeReviews {
  key: keyof IReview;
  index: number;
  value: string | Date | number;
}

export interface ChangeDescription {
  key: keyof Omit<IState['createCompanyForm'], 'reviews' | 'speakers'>;
  value: string | File | null;
}

const marketplaceSlice = createSlice({
  name: 'marketplace',
  initialState,
  reducers: {
    changeSearch(state, action: PayloadAction<string>) {
      state.searchValue = action.payload;
    },

    changeFilter(state, action: PayloadAction<FilterValue>) {
      state.selectedFilter = action.payload;
    },

    changeCreateCompanyTab(state, action: PayloadAction<CreateCompanyTabs>) {
      state.activeCreateCompanyTab = action.payload;
    },

    //* DESCRIPTION */

    changeDescription(state, action: PayloadAction<ChangeDescription>) {
      const { key, value } = action.payload;
      // @ts-expect-error
      state.createCompanyForm[key].value = value;
      // @ts-expect-error
      state.createCompanyForm[key].error = '';
      const { description, logo, title } = state.createCompanyForm;
      if (description.value && logo.value && title.value) {
        state.createCompanyForm.canSubmit = true;
      } else {
        state.createCompanyForm.canSubmit = false;
      }
    },

    //* SPEAKERS */

    changeSpeakers(state, action: PayloadAction<ChangeSpeakers>) {
      const { index, key, value } = action.payload;
      //@ts-expect-error
      state.createCompanyForm.speakers[index][key] = value;
    },
    addSpeaker(state) {
      const newSpeaker = {
        ...initSpeaker,
        id: state.createCompanyForm.speakers.length,
      };

      state.createCompanyForm.speakers.push(newSpeaker);
    },
    deleteSpeaker(state, action: PayloadAction<number>) {
      state.createCompanyForm.speakers =
        state.createCompanyForm.speakers.filter(
          ({ id }) => id !== action.payload
        );
    },
    swapSpeakers(
      state,
      action: PayloadAction<{ destIndex: number; index: number }>
    ) {
      const { destIndex, index } = action.payload;
      const [item] = state.createCompanyForm.speakers.splice(index, 1);
      state.createCompanyForm.speakers.splice(destIndex, 0, item);
    },

    //* REVIEWS */

    changeReviews(state, action: PayloadAction<ChangeReviews>) {
      const { index, key, value } = action.payload;
      //@ts-ignore
      state.createCompanyForm.reviews[index][key] = value;
    },
    addReview(state) {
      const newReview = {
        ...initReview,
        id: state.createCompanyForm.reviews.length,
      };
      state.createCompanyForm.reviews.push(newReview);
    },
    swapReviews(
      state,
      action: PayloadAction<{ destIndex: number; index: number }>
    ) {
      const { destIndex, index } = action.payload;
      const [item] = state.createCompanyForm.reviews.splice(index, 1);
      state.createCompanyForm.reviews.splice(destIndex, 0, item);
    },
    deleteReview(state, action: PayloadAction<number>) {
      state.createCompanyForm.reviews = state.createCompanyForm.reviews.filter(
        ({ id }) => id !== action.payload
      );
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAllCompanies.fulfilled, (state, action) => {
      state.companies = action.payload.companies;
    });
    builder.addCase(fetchAllCompanies.rejected, (state, action) => {
      console.error(action.payload);
    });

    builder.addCase(submitCompany.fulfilled, (state) => {
      state.createCompanyForm.canSubmit = false;
      state.createCompanyForm.description.value = '';
      state.createCompanyForm.logo.value = null;
      state.createCompanyForm.title.value = '';
      state.createCompanyForm.speakers = [initSpeaker];
      state.createCompanyForm.reviews = [initReview];
    });
  },
});

export const { actions: marketplaceActions, reducer: marketplaceReducer } =
  marketplaceSlice;
