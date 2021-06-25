import { createMuiTheme } from '@material-ui/core/styles';

// A custom theme for this app
const theme = createMuiTheme({
    palette: {
        primary: {
            main: '#576fa0',
        },
        secondary: {
            main: '#f58220',
        },
        background: {
            default: '#fff',
        },
        ntr: {
            main: '#ffffff',
        },
        pending: {
            light: '#bfbfbf',
            main: '#808080',
            dark: '#404040',
        },
        success: {
            main: '#4caf50',
        },
        warning: {
            main: '#ff9800',
        },
        error: {
            main: '#f44336',
        },
    },
});

export default theme;
