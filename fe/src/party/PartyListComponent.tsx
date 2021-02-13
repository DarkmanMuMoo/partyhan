import { makeStyles } from '@material-ui/core/styles';
import { useObserver } from "mobx-react-lite"
import {
    Container, Button, Avatar, Grid, Toolbar, IconButton, AppBar
    , Typography ,Tooltip, Fab
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { logout } from '../service/UserService'
import { subscribe } from '../service/PartyService'

import React, { useEffect } from 'react';
import {
    useHistory
} from "react-router-dom";
import JWTStore from '../user/JWTStore'
import PartyStore from '../party/PartyStore'
import {  useSnackbar } from 'notistack'
import PartyComponent from './PartyComponent'

const useStyles = makeStyles((theme) => ({
    icon: {
        marginRight: theme.spacing(2),
    },
    heroContent: {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(8, 0, 6),
    },
    heroButtons: {
        marginTop: theme.spacing(4),
    },
    cardGrid: {
        paddingTop: theme.spacing(8),
        paddingBottom: theme.spacing(8),
    },
    card: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
    },
    cardMedia: {
        paddingTop: '56.25%', // 16:9
    },
    cardContent: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
    footer: {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(6),
    },
    fab: {
        margin: theme.spacing(2),
    },
    absolute: {
        position: 'absolute',
        bottom: theme.spacing(2),
        right: theme.spacing(3),
    },
}));


const PartyListComponent = () => {
    const classes = useStyles();
    let history = useHistory()
    const { enqueueSnackbar } = useSnackbar();

    const performLogout = () => {
        logout()
        history.push('/login')
    }
    
    useEffect(() => {        

        PartyStore.joinableParty(JWTStore.jwt)

    }, []);



    async function performSubScribe(id: number) {
        try {
            await subscribe(id,JWTStore.jwt)
            enqueueSnackbar("join party success", { variant:"success" })
            await PartyStore.joinableParty(JWTStore.jwt)
        } catch (error) {
            console.log(error)
            enqueueSnackbar(error.response.data.message, { variant:"error" })
        }

    }

    return useObserver(() => (<>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" className={classes.title}>
                        Party you can join
                </Typography>
                    <IconButton
                        aria-label="account of current user"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        color="inherit"
                    >
                        <Button color="inherit" onClick={performLogout}>Logout </Button>
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Container className={classes.cardGrid} maxWidth="md" >
                <Grid container spacing={4}>
                    {PartyStore.partyList.map(p =>
                        <Grid item key={p.id} xs={12} sm={6} md={4}>
                            <PartyComponent party={p} onSubscribe={performSubScribe} />
                        </Grid>
                    )}


                </Grid>
            </Container>
            <Tooltip title="Create Party" aria-label="Create Party">
                <Fab color="secondary" className={classes.absolute} onClick={() => history.push("party")}>
                    <AddIcon />
                </Fab>
            </Tooltip>

    </>))

}

export default PartyListComponent