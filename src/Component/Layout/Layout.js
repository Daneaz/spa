import React from 'react';
import { Link, NavLink } from "react-router-dom";
import { withStyles } from '@material-ui/styles';
import {
    CssBaseline, Hidden, Container,
    AppBar, Toolbar, Drawer,
    List, ListItem, ListItemIcon, ListItemAvatar, ListItemText, Divider,
    Typography,
    IconButton, Avatar,
    Menu, MenuItem,
} from '@material-ui/core';
import {
    Menu as MenuIcon,
    Spa as SpaIcon,
    Dashboard as DashboardIcon,
    CalendarToday as CalendarIcon,
    Work as StaffIcon,
    BarChart as BarChartIcon,
    People as PeopleIcon,
    Message as MessageIcon,
    AccountCircle as AccountCircleIcon,
    Settings as SettingsIcon,
    Payment as InvoiceIcon
} from '@material-ui/icons';
import { removeToken, removeUser, getAvatarLetter } from '../../utils';

const drawerWidth = 240;

const styles = theme => ({
    root: {
        display: 'flex',
    },
    drawer: {
        [theme.breakpoints.up('sm')]: {
            width: drawerWidth,
            flexShrink: 0,
        },
    },
    appBar: {
        marginLeft: drawerWidth,
        [theme.breakpoints.up('sm')]: {
            width: `calc(100% - ${drawerWidth}px)`,
        },
    },
    menuButton: {
        marginRight: theme.spacing(2),
        [theme.breakpoints.up('sm')]: {
            display: 'none',
        },
    },
    title: {
        flexGrow: 1,
    },
    menuAvatar: {
        width: 40,
        height: 40,
    },
    toolbar: theme.mixins.toolbar,
    drawerPaper: {
        width: drawerWidth,
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },
    activeListItem: {
        //borderLeft: `4px solid ${theme.palette.primary.main}`,
        //borderRadius: '4px',
        backgroundColor: theme.palette.grey[300],
        '& $listItemText': {
            color: theme.palette.text.primary
        },
        '& $listItemIcon': {
            color: theme.palette.text.primary,
            marginLeft: '-4px'
        }
    },
    listItem: {
        cursor: 'pointer',
        '&:hover': {
            backgroundColor: theme.palette.grey[300],
            //borderLeft: `4px solid ${theme.palette.primary.main}`,
            //borderRadius: '4px',
            '& $listItemIcon': {
                color: theme.palette.text.primary,
                marginLeft: '-4px'
            }
        },
        '& + &': {
            marginTop: theme.spacing.unit
        }
    },
    listItemText: {
        fontWeight: 500,
        color: theme.palette.text.secondary
    },
});

function NavMenu(props) {
    return (
        <div>
            <div className={props.classes.toolbar}>
                <img src={require('../../images/logo.png')} alt="Logo" style={{ width: 180, marginTop: 12, marginBottom: 8, marginLeft: 30 }} />
            </div>
            <Divider />
            <List>
                <ListItem>
                    <ListItemAvatar>
                        <Avatar className={props.classes.menuAvatar}>{getAvatarLetter(props.user.displayName)}</Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={props.user.displayName} secondary={(props.user.email.length > 20) ? `${props.user.email.substr(0, 20)}...` : props.user.email} />
                </ListItem>
            </List>
            <Divider />
            <List>
                <ListItem
                    activeClassName={props.classes.activeListItem}
                    className={props.classes.listItem}
                    component={NavLink}
                    to="/dashboard"
                >
                    <ListItemIcon className={props.classes.listItemIcon}>
                        <DashboardIcon />
                    </ListItemIcon>
                    <ListItemText
                        classes={{ primary: props.classes.listItemText }}
                        primary="Dashboard"
                    />
                </ListItem>
                <ListItem
                    activeClassName={props.classes.activeListItem}
                    className={props.classes.listItem}
                    component={NavLink}
                    to="/appointment"
                >
                    <ListItemIcon className={props.classes.listItemIcon}>
                        <CalendarIcon />
                    </ListItemIcon>
                    <ListItemText
                        classes={{ primary: props.classes.listItemText }}
                        primary="Appointment"
                    />
                </ListItem>
                <ListItem
                    activeClassName={props.classes.activeListItem}
                    className={props.classes.listItem}
                    component={NavLink}
                    to="/client"
                >
                    <ListItemIcon className={props.classes.listItemIcon}>
                        <PeopleIcon />
                    </ListItemIcon>
                    <ListItemText
                        classes={{ primary: props.classes.listItemText }}
                        primary="Clients"
                    />
                </ListItem>
                <ListItem
                    activeClassName={props.classes.activeListItem}
                    className={props.classes.listItem}
                    component={NavLink}
                    to="/staff"
                >
                    <ListItemIcon className={props.classes.listItemIcon}>
                        <StaffIcon />
                    </ListItemIcon>
                    <ListItemText
                        classes={{ primary: props.classes.listItemText }}
                        primary="Staffs"
                    />
                </ListItem>

                <ListItem
                    activeClassName={props.classes.activeListItem}
                    className={props.classes.listItem}
                    component={NavLink}
                    to="/service"
                >
                    <ListItemIcon className={props.classes.listItemIcon}>
                        <SpaIcon />
                    </ListItemIcon>
                    <ListItemText
                        classes={{ primary: props.classes.listItemText }}
                        primary="Services"
                    />
                </ListItem>

                <ListItem
                    activeClassName={props.classes.activeListItem}
                    className={props.classes.listItem}
                    component={NavLink}
                    to="/invoice"
                >
                    <ListItemIcon className={props.classes.listItemIcon}>
                        <InvoiceIcon />
                    </ListItemIcon>
                    <ListItemText
                        classes={{ primary: props.classes.listItemText }}
                        primary="Invoice"
                    />
                </ListItem>

                <ListItem
                    activeClassName={props.classes.activeListItem}
                    className={props.classes.listItem}
                    component={NavLink}
                    to="/message" style={{display: "none"}}
                >
                    <ListItemIcon className={props.classes.listItemIcon}>
                        <MessageIcon />
                    </ListItemIcon>
                    <ListItemText
                        classes={{ primary: props.classes.listItemText }}
                        primary="Client Message"
                    />
                </ListItem>

                <ListItem
                    activeClassName={props.classes.activeListItem}
                    className={props.classes.listItem}
                    component={NavLink}
                    to="/report" style={{display: "none"}}
                >
                    <ListItemIcon className={props.classes.listItemIcon}>
                        <BarChartIcon />
                    </ListItemIcon>
                    <ListItemText
                        classes={{ primary: props.classes.listItemText }}
                        primary="Reports"
                    />
                </ListItem>

                <ListItem
                    activeClassName={props.classes.activeListItem}
                    className={props.classes.listItem}
                    component={NavLink}
                    to="/setting" style={{display: "none"}}
                >
                    <ListItemIcon className={props.classes.listItemIcon}>
                        <SettingsIcon />
                    </ListItemIcon>
                    <ListItemText
                        classes={{ primary: props.classes.listItemText }}
                        primary="Settings"
                    />
                </ListItem>

            </List>
        </div>
    );
}

function AccountMenu(props) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    function handleMenu(event) { setAnchorEl(event.currentTarget) }
    function handleClose() { setAnchorEl(null) }

    return (
        <div>
            <IconButton
                aria-controls="menu-appbar" aria-haspopup="true"
                onClick={handleMenu} color="inherit"
            >
                <AccountCircleIcon />
            </IconButton>
            <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{ vertical: 'top', horizontal: 'right', }}
                keepMounted
                transformOrigin={{ vertical: 'top', horizontal: 'right', }}
                open={open} onClose={handleClose}
            >
                {/* <MenuItem onClick={handleClose} button component={Link} to="/profile">Profile</MenuItem> */}
                <MenuItem onClick={() => {
                    removeToken(); removeUser();
                    props.history.push("/login")
                }
                }>Logout</MenuItem>
            </Menu>
        </div>
    );
}


class AppLayout extends React.Component {

    constructor(props) {
        super(props);
        this.state = { mobileOpen: false };
    }

    handleDrawerToggle = () => { this.setState({ mobileOpen: !this.state.mobileOpen }) };

    render() {
        const { classes } = this.props;

        return (
            <div className={classes.root}>
                <CssBaseline />
                <AppBar position="fixed" className={classes.appBar} >
                    <Toolbar>
                        <IconButton
                            color="inherit"
                            aria-label="Open drawer"
                            edge="start"
                            onClick={this.handleDrawerToggle}
                            className={classes.menuButton}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" className={classes.title}>
                            {this.props.title}
                        </Typography>
                        <AccountMenu {...this.props} />
                    </Toolbar>
                </AppBar>
                <nav className={classes.drawer} aria-label="Mailbox folders">
                    <Hidden smUp implementation="css">
                        <Drawer
                            variant="temporary"
                            anchor='left'
                            open={this.state.mobileOpen}
                            onClose={this.handleDrawerToggle}
                            classes={{ paper: classes.drawerPaper }}
                            ModalProps={{
                                keepMounted: true, // Better open performance on mobile.
                            }}
                        >
                            <NavMenu {...this.props} />
                        </Drawer>
                    </Hidden>
                    <Hidden xsDown implementation="css">
                        <Drawer
                            classes={{ paper: classes.drawerPaper }}
                            variant="permanent"
                            open
                        >
                            <NavMenu {...this.props} />
                        </Drawer>
                    </Hidden>
                </nav>
                <main className={classes.content}>
                    <div className={classes.toolbar} />
                    <Container maxWidth={false} >
                        {this.props.children}
                    </Container>
                </main>
            </div>
        )
    }
}

export default withStyles(styles)(AppLayout);
