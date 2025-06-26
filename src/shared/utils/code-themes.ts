export type CodeThemeId = 'github' | 'github-dark' | 'dracula' | 'monokai' | 'nord' | 'one-dark'

interface CodeTheme {
  id: CodeThemeId
  name: string
  theme: {
    background: string
    text: string
    comment: string
    keyword: string
    function: string
    string: string
    number: string
    operator: string
    punctuation: string
    variable: string
    class: string
    property: string
    tag: string
    attr: string
    value: string
  }
}

export const codeThemes: CodeTheme[] = [
  {
    id: 'github',
    name: 'GitHub Light',
    theme: {
      background: '#f6f8fa',
      text: '#24292e',
      comment: '#6a737d',
      keyword: '#d73a49',
      function: '#6f42c1',
      string: '#032f62',
      number: '#005cc5',
      operator: '#d73a49',
      punctuation: '#24292e',
      variable: '#e36209',
      class: '#6f42c1',
      property: '#005cc5',
      tag: '#22863a',
      attr: '#6f42c1',
      value: '#032f62'
    }
  },
  {
    id: 'github-dark',
    name: 'GitHub Dark',
    theme: {
      background: '#0d1117',
      text: '#c9d1d9',
      comment: '#8b949e',
      keyword: '#ff7b72',
      function: '#d2a8ff',
      string: '#a5d6ff',
      number: '#79c0ff',
      operator: '#ff7b72',
      punctuation: '#c9d1d9',
      variable: '#ffa657',
      class: '#d2a8ff',
      property: '#79c0ff',
      tag: '#7ee787',
      attr: '#d2a8ff',
      value: '#a5d6ff'
    }
  },
  {
    id: 'dracula',
    name: 'Dracula',
    theme: {
      background: '#282a36',
      text: '#f8f8f2',
      comment: '#6272a4',
      keyword: '#ff79c6',
      function: '#50fa7b',
      string: '#f1fa8c',
      number: '#bd93f9',
      operator: '#ff79c6',
      punctuation: '#f8f8f2',
      variable: '#ffb86c',
      class: '#8be9fd',
      property: '#8be9fd',
      tag: '#ff79c6',
      attr: '#50fa7b',
      value: '#f1fa8c'
    }
  },
  {
    id: 'monokai',
    name: 'Monokai',
    theme: {
      background: '#272822',
      text: '#f8f8f2',
      comment: '#75715e',
      keyword: '#f92672',
      function: '#a6e22e',
      string: '#e6db74',
      number: '#ae81ff',
      operator: '#f92672',
      punctuation: '#f8f8f2',
      variable: '#fd971f',
      class: '#66d9ef',
      property: '#66d9ef',
      tag: '#f92672',
      attr: '#a6e22e',
      value: '#e6db74'
    }
  },
  {
    id: 'nord',
    name: 'Nord',
    theme: {
      background: '#2e3440',
      text: '#d8dee9',
      comment: '#4c566a',
      keyword: '#81a1c1',
      function: '#88c0d0',
      string: '#a3be8c',
      number: '#b48ead',
      operator: '#81a1c1',
      punctuation: '#d8dee9',
      variable: '#d08770',
      class: '#8fbcbb',
      property: '#88c0d0',
      tag: '#81a1c1',
      attr: '#8fbcbb',
      value: '#a3be8c'
    }
  },
  {
    id: 'one-dark',
    name: 'One Dark',
    theme: {
      background: '#282c34',
      text: '#abb2bf',
      comment: '#5c6370',
      keyword: '#c678dd',
      function: '#61afef',
      string: '#98c379',
      number: '#d19a66',
      operator: '#56b6c2',
      punctuation: '#abb2bf',
      variable: '#e06c75',
      class: '#e5c07b',
      property: '#61afef',
      tag: '#e06c75',
      attr: '#d19a66',
      value: '#98c379'
    }
  }
] 