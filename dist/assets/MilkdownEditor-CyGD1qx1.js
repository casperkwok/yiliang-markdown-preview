import{j as s}from"./markdown-vendor-C6ok9kfM.js";import{r as i}from"./milkdown-Bq6YiaW2.js";import{u as h}from"./index-DIpeRGO5.js";import{u as k}from"./i18n-vendor-BtI8lwTL.js";import"./diagram-math-kerwj6V3.js";import"./react-vendor-CwmUxUDx.js";import"./lark-vendor-DPgJTNkO.js";import"./ui-vendor-BkFyFQuj.js";const v=({content:r,onChange:l,className:p=""})=>{const{t:m}=k(),{isDarkMode:t}=h(),[n,a]=i.useState(r),f=i.useRef(null);i.useEffect(()=>{a(r)},[r]);const u=o=>{const e=o.target.value;a(e),l(e)},w=o=>{if(o.key==="Tab"){o.preventDefault();const e=o.currentTarget,d=e.selectionStart,x=e.selectionEnd,c=n.substring(0,d)+"  "+n.substring(x);a(c),l(c),setTimeout(()=>{e.selectionStart=e.selectionEnd=d+2},0)}};return s.jsxs("div",{className:`markdown-editor-wrapper ${p}`,children:[s.jsx("style",{children:`
                .markdown-editor-wrapper {
                    background: ${t?"#1f2937":"white"};
                    color: ${t?"#f3f4f6":"black"};
                    height: 100%;
                    width: 100%;
                }
                
                .markdown-editor-wrapper .markdown-textarea {
                    width: 100%;
                    height: 100%;
                    background: ${t?"#1f2937":"white"};
                    color: ${t?"#f3f4f6":"black"};
                    border: none;
                    outline: none;
                    resize: none;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
                    font-size: 14px;
                    line-height: 1.6;
                    padding: 24px 24px 80px 24px;
                    margin: 0;
                    box-sizing: border-box;
                }
                
                .markdown-editor-wrapper .markdown-textarea:focus {
                    outline: none;
                    box-shadow: none;
                }
                
                .markdown-editor-wrapper .markdown-textarea::placeholder {
                    color: ${t?"#9ca3af":"#999"};
                }
            `}),s.jsx("textarea",{ref:f,className:"markdown-textarea",value:n,onChange:u,onKeyDown:w,placeholder:m("editor.placeholder"),spellCheck:!1})]})};export{v as MilkdownEditor};
