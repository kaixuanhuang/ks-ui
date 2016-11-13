let themeConst = "ks-content.md-THEME_NAME-theme{color:'{{foreground-1}}';background-color:'{{background-default}}'}body.md-THEME_NAME-theme,html.md-THEME_NAME-theme{color:'{{foreground-1}}';background-color:'{{background-color}}'}ks-checkbox.md-THEME_NAME-theme .md-ripple{color:'{{accent-A700}}'}ks-checkbox.md-THEME_NAME-theme.ks-checked .md-ripple{color:'{{background-600}}'}ks-checkbox.md-THEME_NAME-theme .md-ink-ripple{color:'{{foreground-2}}'}ks-checkbox.md-THEME_NAME-theme.ks-checked .md-ink-ripple{color:'{{accent-color-0.87}}'}ks-checkbox.md-THEME_NAME-theme.ks-checked.md-focused .ks-container:before{background-color:'{{accent-color-0.26}}'}ks-checkbox.md-THEME_NAME-theme:not(.ks-checked) .check-icon{border-color:'{{foreground-2}}'}ks-checkbox.md-THEME_NAME-theme.ks-checked .check-icon{background-color:'{{accent-color-0.87}}'}ks-checkbox.md-THEME_NAME-theme.ks-checked .check-icon:after{border-color:'{{accent-contrast-0.87}}'}ks-checkbox.md-THEME_NAME-theme:not([disabled]).md-primary .md-ripple{color:'{{primary-600}}'}ks-checkbox.md-THEME_NAME-theme:not([disabled]).md-primary.ks-checked .md-ripple{color:'{{background-600}}'}ks-checkbox.md-THEME_NAME-theme:not([disabled]).md-primary .md-ink-ripple{color:'{{foreground-2}}'}ks-checkbox.md-THEME_NAME-theme:not([disabled]).md-primary.ks-checked .md-ink-ripple{color:'{{primary-color-0.87}}'}ks-checkbox.md-THEME_NAME-theme:not([disabled]).md-primary:not(.ks-checked) .check-icon{border-color:'{{foreground-2}}'}ks-checkbox.md-THEME_NAME-theme:not([disabled]).md-primary.ks-checked .check-icon{background-color:'{{primary-color-0.87}}'}ks-checkbox.md-THEME_NAME-theme:not([disabled]).md-primary.ks-checked.md-focused .md-container:before{background-color:'{{primary-color-0.26}}'}ks-checkbox.md-THEME_NAME-theme:not([disabled]).md-primary.ks-checked .check-icon:after{border-color:'{{primary-contrast-0.87}}'}ks-checkbox.md-THEME_NAME-theme:not([disabled]).md-primary .md-indeterminate[disabled] .md-container{color:'{{foreground-3}}'}ks-checkbox.md-THEME_NAME-theme:not([disabled]).md-warn .md-ripple{color:'{{warn-600}}'}ks-checkbox.md-THEME_NAME-theme:not([disabled]).md-warn .md-ink-ripple{color:'{{foreground-2}}'}ks-checkbox.md-THEME_NAME-theme:not([disabled]).md-warn.ks-checked .md-ink-ripple{color:'{{warn-color-0.87}}'}ks-checkbox.md-THEME_NAME-theme:not([disabled]).md-warn:not(.ks-checked) .check-icon{border-color:'{{foreground-2}}'}ks-checkbox.md-THEME_NAME-theme:not([disabled]).md-warn.ks-checked .check-icon{background-color:'{{warn-color-0.87}}'}ks-checkbox.md-THEME_NAME-theme:not([disabled]).md-warn.ks-checked.md-focused:not([disabled]) .md-container:before{background-color:'{{warn-color-0.26}}'}ks-checkbox.md-THEME_NAME-theme:not([disabled]).md-warn.ks-checked .check-icon:after{border-color:'{{background-200}}'}ks-checkbox.md-THEME_NAME-theme[disabled]:not(.ks-checked) .check-icon{border-color:'{{foreground-3}}'}ks-checkbox.md-THEME_NAME-theme[disabled].ks-checked .check-icon{background-color:'{{foreground-3}}'}ks-checkbox.md-THEME_NAME-theme[disabled].ks-checked .check-icon:after{border-color:'{{background-200}}'}ks-checkbox.md-THEME_NAME-theme[disabled] .check-icon:after{border-color:'{{foreground-3}}'}ks-checkbox.md-THEME_NAME-theme[disabled] .ks-label{color:'{{foreground-3}}'}ks-table.md-THEME_NAME-theme table>thead>tr{background-color:'{{primary-color-0.87}}'}ks-icon.md-THEME_NAME-theme.md-primary{color:'{{primary-color}}'}ks-icon.md-THEME_NAME-theme.md-accent{color:'{{accent-color}}'}ks-icon.md-THEME_NAME-theme.md-warn{color:'{{warn-color}}'}ks-field.md-THEME_NAME-theme .ks-input{color:'{{foreground-1}}';border-color:'{{primary-color-1}}'}ks-field.md-THEME_NAME-theme .ks-input:-moz-placeholder,ks-field.md-THEME_NAME-theme .ks-input::-moz-placeholder{color:'{{foreground-3}}'}ks-field.md-THEME_NAME-theme .ks-input:-ms-input-placeholder{color:'{{foreground-3}}'}ks-field.md-THEME_NAME-theme .ks-input::-webkit-input-placeholder{color:'{{foreground-3}}'}ks-field.md-THEME_NAME-theme>ks-icon{color:'{{foreground-1}}'}ks-field.md-THEME_NAME-theme .md-placeholder,ks-field.md-THEME_NAME-theme label{color:'{{foreground-3}}'}ks-field.md-THEME_NAME-theme label.md-required:after{color:'{{warn-A700}}'}ks-field.md-THEME_NAME-theme:not(.md-input-focused):not(.md-input-invalid) label.md-required:after{color:'{{foreground-2}}'}ks-field.md-THEME_NAME-theme .md-input-message-animation,ks-field.md-THEME_NAME-theme .md-input-messages-animation{color:'{{warn-A700}}'}ks-field.md-THEME_NAME-theme .md-input-message-animation .md-char-counter,ks-field.md-THEME_NAME-theme .md-input-messages-animation .md-char-counter{color:'{{foreground-1}}'}ks-field.md-THEME_NAME-theme.md-input-focused .md-input:-moz-placeholder,ks-field.md-THEME_NAME-theme.md-input-focused .md-input::-moz-placeholder{color:'{{foreground-2}}'}ks-field.md-THEME_NAME-theme.md-input-focused .md-input:-ms-input-placeholder{color:'{{foreground-2}}'}ks-field.md-THEME_NAME-theme.md-input-focused .md-input::-webkit-input-placeholder{color:'{{foreground-2}}'}ks-field.md-THEME_NAME-theme:not(.md-input-invalid).md-input-has-value label{color:'{{foreground-2}}'}ks-field.md-THEME_NAME-theme:not(.md-input-invalid).md-input-focused .md-input,ks-field.md-THEME_NAME-theme:not(.md-input-invalid).md-input-resized .md-input{border-color:'{{primary-color}}'}ks-field.md-THEME_NAME-theme:not(.md-input-invalid).md-input-focused label,ks-field.md-THEME_NAME-theme:not(.md-input-invalid).md-input-focused md-icon{color:'{{primary-color}}'}ks-field.md-THEME_NAME-theme:not(.md-input-invalid).md-input-focused.md-accent .md-input{border-color:'{{accent-color}}'}ks-field.md-THEME_NAME-theme:not(.md-input-invalid).md-input-focused.md-accent label,ks-field.md-THEME_NAME-theme:not(.md-input-invalid).md-input-focused.md-accent md-icon{color:'{{accent-color}}'}ks-field.md-THEME_NAME-theme:not(.md-input-invalid).md-input-focused.md-warn .md-input{border-color:'{{warn-A700}}'}ks-field.md-THEME_NAME-theme:not(.md-input-invalid).md-input-focused.md-warn label,ks-field.md-THEME_NAME-theme:not(.md-input-invalid).md-input-focused.md-warn md-icon{color:'{{warn-A700}}'}ks-field.md-THEME_NAME-theme.md-input-invalid .md-input{border-color:'{{warn-A700}}'}ks-field.md-THEME_NAME-theme.md-input-invalid .md-char-counter,ks-field.md-THEME_NAME-theme.md-input-invalid .md-input-message-animation,ks-field.md-THEME_NAME-theme.md-input-invalid label{color:'{{warn-A700}}'}[disabled] ks-field.md-THEME_NAME-theme .ks-input,ks-field.md-THEME_NAME-theme .ks-input[disabled]{border-bottom-color:transparent;color:'{{foreground-3}}';background-image:linear-gradient(90deg,\"{{foreground-3}}\" 0,\"{{foreground-3}}\" 33%,transparent 0);background-image:-ms-linear-gradient(left,transparent 0,\"{{foreground-3}}\" 100%)}ks-pagination.md-THEME_NAME-theme li.active span{color:#fff}ks-pagination.md-THEME_NAME-theme li.active{background-color:'{{primary-color}}'}ks-pagination.md-THEME_NAME-theme li.disabled span{cursor:default;color:#999}ks-toolbar.md-THEME_NAME-theme{background-color:'{{primary-color}}';color:'{{primary-contrast}}'}ks-toolbar.md-THEME_NAME-theme.md-warn{background-color:'{{warn-color}}';color:'{{warn-contrast}}'}";
 export default  themeConst;
