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
  ],
  subtractForOther: [],
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
  ],
  subtractForOther: [],
};

export const allDatasets: DatasetConfig[] = [populationConfig, enrolmentConfig];
