import {
    TextField, Container, Button, Avatar, Grid,
    Link as MLink
} from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { login } from '../service/UserService'
import React, { useState } from 'react';
import {
    useHistory,
    Link
} from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import {  useSnackbar } from 'notistack'


const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));


const LoginComponent = () => {

    let history = useHistory()
    const { enqueueSnackbar } = useSnackbar();
    const classes = useStyles();

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: yup.object({
            email: yup.string()
                .email('Enter a valid email')
                .required('Email is required'),
            password: yup.string()
                .min(8, 'Password should be of minimum 8 characters length')
                .required('Password is required'),
        }),
        onSubmit: (values) => {
            (async () => {
                try {
                    await login(values)
                    history.push('/party-list')
                } catch (error) {
                    console.log(error)
                    enqueueSnackbar(error.response.data.message,{variant:'error'})
                }
            })()
        },
    })

    return (
        <Container>
            <div className={classes.paper}>
            <Avatar className={classes.avatar} >
                    <LockOutlinedIcon />
                </Avatar>
                <form autoComplete="off" noValidate onSubmit={formik.handleSubmit}>

                    <TextField
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        value={formik.values.email}
                        autoFocus
                        onChange={formik.handleChange}
                        error={formik.touched.email && !!(formik.errors.email)}
                        helperText={formik.touched.email && formik.errors.email}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        value={formik.values.password}
                        autoComplete="current-password"
                        onChange={formik.handleChange}
                        error={formik.touched.password && !!(formik.errors.password)}
                        helperText={formik.touched.password && formik.errors.password}
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
                                Sign In
                        </Button>
                        </Grid>
                        <Grid container item spacing={1}>
                            <Button
                                type="button"
                                fullWidth
                                variant="contained"
                                color="secondary"
                                className={classes.submit}
                                onClick={()=>history.push("register")}
                            >
                                
                                    Sign up
                            </Button>
                        </Grid>
                    </Grid>

                </form>
            </div>
        </Container>

    )

}

export default LoginComponent