import type { CodeTheme, CodeThemeId } from '../types/template';

export const codeThemes: CodeTheme[] = [
  {
    id: 'github',
    name: 'GitHub Light',
    className: 'prism-github'
  },
  {
    id: 'github-dark',
    name: 'GitHub Dark',
    className: 'prism-github-dark'
  },
  {
    id: 'monokai',
    name: 'Monokai',
    className: 'prism-monokai'
  },
  {
    id: 'solarized-light',
    name: 'Solarized Light',
    className: 'prism-solarized-light'
  },
  {
    id: 'solarized-dark',
    name: 'Solarized Dark',
    className: 'prism-solarized-dark'
  },
  {
    id: 'vs',
    name: 'VS Light',
    className: 'prism-vs'
  },
  {
    id: 'vs-dark',
    name: 'VS Dark',
    className: 'prism-vs-dark'
  },
  {
    id: 'atom-one-light',
    name: 'Atom One Light',
    className: 'prism-atom-one-light'
  },
  {
    id: 'atom-one-dark',
    name: 'Atom One Dark',
    className: 'prism-atom-one-dark'
  }
];

export const getCodeTheme = (id: CodeThemeId): CodeTheme => {
  return codeThemes.find(theme => theme.id === id) || codeThemes[0];
};

export const getCodeThemeClassName = (id: CodeThemeId): string => {
  return getCodeTheme(id).className;
}; 