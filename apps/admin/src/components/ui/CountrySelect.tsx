'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Search, X, ChevronDown, Check, Globe, RefreshCw } from 'lucide-react';
import { Country, fetchCountries, FALLBACK_COUNTRIES } from '@/lib/countries';

export interface CountrySelectProps {
  label?: string;
  required?: boolean;
  multiple?: boolean;
  value: string | string[];
  onChange: (value: any) => void;
  placeholder?: string;
  helperText?: string;
  disabled?: boolean;
  className?: string;
  quickPicks?: string[];
}

const DEFAULT_QUICK_PICKS = [
  'Nepal',
  'Japan',
  'United Kingdom',
  'Australia',
  'United States',
  'Germany',
  'South Korea',
  'Canada',
  'India',
  'China',
];

export default function CountrySelect({
  label,
  required = false,
  multiple = true,
  value,
  onChange,
  placeholder = 'Select countries...',
  helperText,
  disabled = false,
  className = '',
  quickPicks = DEFAULT_QUICK_PICKS,
}: CountrySelectProps) {
  const [countries, setCountries] = useState<Country[]>(FALLBACK_COUNTRIES);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Normalize selected values into an array
  const selectedValues: string[] = useMemo(() => {
    if (Array.isArray(value)) return value;
    if (typeof value === 'string' && value && value !== 'ALL') return [value];
    return [];
  }, [value]);

  // Fetch live countries on mount
  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        setLoading(true);
        const data = await fetchCountries();
        if (mounted && Array.isArray(data) && data.length > 0) {
          const seen = new Set<string>();
          const deduped: Country[] = [];
          data.forEach((c) => {
            const code = (c.code || '').toUpperCase().trim();
            if (code && !seen.has(code)) {
              seen.add(code);
              deduped.push(c);
            }
          });
          setCountries(deduped);
        }
      } catch (err) {
        console.warn('Failed to fetch countries, using fallback', err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    } else {
      setSearch('');
    }
  }, [isOpen]);

  // Filter countries by search term
  const filteredCountries = useMemo(() => {
    if (!search.trim()) return countries;
    const q = search.toLowerCase().trim();
    return countries.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q)
    );
  }, [countries, search]);

  const handleSelect = (countryName: string) => {
    if (multiple) {
      const exists = selectedValues.includes(countryName);
      const next = exists
        ? selectedValues.filter((c) => c !== countryName)
        : [...selectedValues, countryName];
      onChange(next);
    } else {
      onChange(countryName);
      setIsOpen(false);
    }
  };

  const handleRemove = (countryName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (multiple) {
      onChange(selectedValues.filter((c) => c !== countryName));
    } else {
      onChange('');
    }
  };

  const handleClearAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(multiple ? [] : '');
  };

  return (
    <div className={`space-y-1.5 ${className}`} ref={containerRef}>
      {label && (
        <div className="flex items-center justify-between">
          <label className="block text-xs font-semibold text-slate-700">
            {label} {required && <span className="text-rose-500">*</span>}
          </label>
          {multiple && selectedValues.length > 0 && (
            <button
              type="button"
              onClick={handleClearAll}
              className="text-[11px] text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
            >
              Clear all ({selectedValues.length})
            </button>
          )}
        </div>
      )}

      {/* Main Trigger / Selector Box */}
      <div className="relative">
        <button
          type="button"
          disabled={disabled}
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full min-h-[42px] px-3.5 py-2 rounded-2xl border text-left flex items-center justify-between gap-2 transition-all cursor-pointer bg-white ${
            isOpen
              ? 'border-[#4b37df] ring-2 ring-[#4b37df]/10 shadow-xs'
              : 'border-slate-200 hover:border-slate-300'
          } ${disabled ? 'opacity-60 cursor-not-allowed bg-slate-50' : ''}`}
        >
          <div className="flex flex-wrap items-center gap-1.5 flex-1 overflow-hidden py-0.5">
            {selectedValues.length === 0 ? (
              <span className="text-xs sm:text-sm text-slate-400 flex items-center gap-2">
                <Globe className="w-3.5 h-3.5 text-slate-400" />
                <span>{placeholder}</span>
              </span>
            ) : multiple ? (
              selectedValues.map((name) => {
                const c = countries.find((item) => item.name === name);
                const flag = c?.flag || '🌐';
                return (
                  <span
                    key={name}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-800 border border-slate-200/60 shrink-0"
                  >
                    <span>{flag}</span>
                    <span className="max-w-[140px] truncate">{name}</span>
                    <span
                      role="button"
                      tabIndex={0}
                      onClick={(e) => handleRemove(name, e)}
                      className="text-slate-400 hover:text-rose-600 transition-colors ml-0.5 p-0.5 rounded-full hover:bg-slate-200"
                      title={`Remove ${name}`}
                    >
                      <X className="w-3 h-3" />
                    </span>
                  </span>
                );
              })
            ) : (
              (() => {
                const c = countries.find((item) => item.name === selectedValues[0]);
                const flag = c?.flag || '🌐';
                return (
                  <span className="flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-900">
                    <span className="text-base">{flag}</span>
                    <span>{selectedValues[0]}</span>
                  </span>
                );
              })()
            )}
          </div>

          <div className="flex items-center gap-1 text-slate-400 shrink-0 ml-1">
            {loading && <RefreshCw className="w-3 h-3 animate-spin text-slate-400" />}
            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180 text-[#4b37df]' : ''}`} />
          </div>
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute left-0 right-0 top-full mt-1.5 z-50 bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Search Input Box */}
            <div className="p-2.5 border-b border-slate-100 bg-slate-50/50">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search countries by name or ISO code..."
                  className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-900 bg-white focus:outline-hidden focus:border-[#4b37df] placeholder:text-slate-400"
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>

            {/* Quick Picks (Only shown when not searching) */}
            {!search && quickPicks.length > 0 && (
              <div className="p-2.5 bg-slate-50/60 border-b border-slate-100">
                <div className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider mb-1.5">
                  Frequent Destinations
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {quickPicks.map((countryName) => {
                    const c = countries.find((item) => item.name === countryName);
                    const flag = c?.flag || '🌐';
                    const isSelected = selectedValues.includes(countryName);
                    return (
                      <button
                        key={countryName}
                        type="button"
                        onClick={() => handleSelect(countryName)}
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-[#4b37df] text-white shadow-2xs'
                            : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200/80'
                        }`}
                      >
                        <span>{flag}</span>
                        <span>{countryName}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Country Options List */}
            <div className="max-h-60 overflow-y-auto divide-y divide-slate-50 p-1">
              {!multiple && (
                <button
                  type="button"
                  onClick={() => {
                    onChange('ALL');
                    setIsOpen(false);
                  }}
                  className={`w-full px-3 py-2 rounded-xl text-left text-xs flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer ${
                    value === 'ALL' || !value ? 'bg-purple-50/60 text-[#4b37df] font-semibold' : 'text-slate-700'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span>🌐</span>
                    <span>All Countries / Global</span>
                  </span>
                  {(value === 'ALL' || !value) && <Check className="w-3.5 h-3.5 text-[#4b37df]" />}
                </button>
              )}

              {filteredCountries.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-400 font-light">
                  No countries match &quot;{search}&quot;
                </div>
              ) : (
                filteredCountries.map((c) => {
                  const isSelected = selectedValues.includes(c.name);
                  return (
                    <button
                      key={c.code}
                      type="button"
                      onClick={() => handleSelect(c.name)}
                      className={`w-full px-3 py-2 rounded-xl text-left text-xs flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-purple-50/80 text-[#4b37df] font-semibold'
                          : 'text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <span className="text-base shrink-0">{c.flag}</span>
                        <span className="truncate">{c.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">({c.code})</span>
                      </div>
                      {isSelected && (
                        <Check className="w-3.5 h-3.5 text-[#4b37df] shrink-0 ml-2" />
                      )}
                    </button>
                  );
                })
              )}
            </div>

            {/* Footer with summary */}
            <div className="px-3 py-2 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span>{countries.length} countries available via live API</span>
              {multiple && (
                <span className="font-medium text-[#4b37df]">
                  {selectedValues.length} selected
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {helperText && (
        <p className="text-[11px] text-slate-400 font-light">{helperText}</p>
      )}
    </div>
  );
}
