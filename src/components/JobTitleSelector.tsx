import React, { useState, useEffect } from 'react';
import { Combobox } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import jobTitles from '@/data/jobTitles.json';

interface JobTitleSelectorProps {
  value: string;
  onChange: (value: string) => void;
  language: 'en' | 'zh';
  error?: string;
  required?: boolean;
  label?: string;
}

export function JobTitleSelector({ value, onChange, language, error, required, label }: JobTitleSelectorProps) {
  const [query, setQuery] = useState('');
  const [filteredTitles, setFilteredTitles] = useState(jobTitles);

  useEffect(() => {
    if (query === '') {
      setFilteredTitles(jobTitles);
    } else {
      const filtered = jobTitles.filter((title) =>
        title.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredTitles(filtered);
    }
  }, [query]);

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-muted-foreground mb-1">
        {label || (language === 'zh' ? '职位' : 'Job Title')}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <Combobox value={value} onChange={onChange}>
        <div className="relative mt-1">
          <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left border border-gray-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
            <Combobox.Input
              className="w-full h-10 px-3 py-2 text-sm border-none leading-5 text-gray-900 focus:ring-0"
              displayValue={(title: string) => title}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={language === 'zh' ? '选择职位' : 'Select job title'}
            />
            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </Combobox.Button>
          </div>
          <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-10">
            {filteredTitles.length === 0 && query !== '' ? (
              <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                {language === 'zh' ? '未找到匹配的职位' : 'Nothing found.'}
              </div>
            ) : (
              filteredTitles.map((title, idx) => (
                <Combobox.Option
                  key={title + '-' + idx}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                      active ? 'bg-teal-600 text-white' : 'text-gray-900'
                    }`
                  }
                  value={title}
                >
                  {({ selected, active }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? 'font-medium' : 'font-normal'
                        }`}
                      >
                        {title}
                      </span>
                      {selected ? (
                        <span
                          className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                            active ? 'text-white' : 'text-teal-600'
                          }`}
                        >
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Combobox.Option>
              ))
            )}
          </Combobox.Options>
        </div>
      </Combobox>
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
} 