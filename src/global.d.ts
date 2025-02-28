/// <reference types="react" />

// Declare global namespace to fix JSX element errors
declare namespace JSX {
  interface Element extends React.ReactElement<any, any> {}
} 