import type { DatasetConfig } from '../types/data';

export const populationConfig: DatasetConfig = {
  id: 'population',
  label: 'Population (18–23)',
  csvPath: 'data/population_18_23.csv',
  stateColumn: 'state',
  categories: [
    {
      slug: 'cat_all',
      label: 'All Categories',
      maleCol: 'cat_all_male',
      femaleCol: 'cat_all_female',
      totalCol: 'cat_all_total',
    },
    {
      slug: 'sc',
      label: 'Scheduled Caste',
      maleCol: 'sc_male',
      femaleCol: 'sc_female',
      totalCol: 'sc_total',
    },
    {
      slug: 'st',
      label: 'Scheduled Tribe',
      maleCol: 'st_male',
      femaleCol: 'st_female',
      totalCol: 'st_total',
    },
  ],
  subtractForOther: ['sc', 'st'],
};

export const enrolmentConfig: DatasetConfig = {
  id: 'enrolment',
  label: 'Enrolment by Social Group',
  csvPath: 'data/enrolment_social_group.csv',
  stateColumn: 'state',
  categories: [
    {
      slug: 'cat_all',
      label: 'All Categories',
      maleCol: 'cat_all_male',
      femaleCol: 'cat_all_female',
      totalCol: 'cat_all_total',
    },
    {
      slug: 'sc',
      label: 'Scheduled Caste',
      maleCol: 'sc_male',
      femaleCol: 'sc_female',
      totalCol: 'sc_total',
    },
    {
      slug: 'st',
      label: 'Scheduled Tribe',
      maleCol: 'st_male',
      femaleCol: 'st_female',
      totalCol: 'st_total',
    },
    {
      slug: 'obc',
      label: 'Other Backward Class',
      maleCol: 'obc_male',
      femaleCol: 'obc_female',
      totalCol: 'obc_total',
    },
  ],
  subtractForOther: ['sc', 'st', 'obc'],
};

export const allDatasets: DatasetConfig[] = [populationConfig, enrolmentConfig];
