import { makeStyles } from '@material-ui/core/styles';
import * as yup from 'yup';
import {
    TextField, Container, Button, Toolbar, IconButton, AppBar, Typography,Grid
} from '@material-ui/core';
import { useFormik } from 'formik';
import { createPary } from '../service/PartyService'
import React, { useState } from 'react';
import {
    useHistory
} from "react-router-dom";
import JWTStore from '../user/JWTStore'
import { useSnackbar } from 'notistack'

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));
const PartyFormComponent = () => {

    const classes = useStyles();
    let history = useHistory()
    const { enqueueSnackbar } = useSnackbar();

    const formik = useFormik({
        initialValues: {
            name: '',
            size: 2,
        },
        validationSchema: yup.object({
            name: yup.string()
                .required('name is required'),
            size: yup.number()
                .min(2, 'size must not least than 2')
                .max(5, 'size limit at 5')
                .required('size is required'),
        }),
        onSubmit: (values) => {
            (async () => {
                try {
                    await createPary(values, JWTStore.jwt)
                    history.push('/party-list')
                } catch (error) {
                    console.log(error)
                    enqueueSnackbar(error.response.data.message, { variant: 'error' })
                }
            })()
        },
    })


    return <>
        <AppBar position="static">
            <Toolbar>
                <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                    <Button color="inherit" onClick={()=>history.push("party-list")}>Back</Button>
                </IconButton>
                <Typography variant="h6" className={classes.title}>
                    Create party
                </Typography>

            </Toolbar>
        </AppBar>
        <Container component="main" maxWidth="md">
            <div >
                <form autoComplete="off" noValidate onSubmit={formik.handleSubmit}>

                    <TextField
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        id="name"
                        label="name"
                        name="name"
                        autoComplete="name"
                        value={formik.values.name}
                        autoFocus
                        onChange={formik.handleChange}
                        error={formik.touched.name && !!(formik.errors.name)}
                        helperText={formik.touched.name && formik.errors.name}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        name="size"
                        label="size"
                        type="number"
                        id="size"
                        value={formik.values.size}
                        autoComplete="size"
                        onChange={formik.handleChange}
                        error={formik.touched.size && !!(formik.errors.size)}
                        helperText={formik.touched.size && formik.errors.size}
                    />
                    <Grid container spacing={1}>
                        <Grid container item spacing={1}>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                className={classes.submit}
                            >
                                createPary
                        </Button>
                        </Grid>
                    </Grid>
                </form>
            </div>
        </Container>





    </>

}

export default PartyFormComponent