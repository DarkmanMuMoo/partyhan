
import { makeStyles } from '@material-ui/core/styles';
import {
  TextField, Container, Button, Avatar, Grid, Typography, Checkbox
  , FormHelperText
  , Dialog
  , DialogTitle
  , DialogContent
  , DialogContentText
  , DialogActions
  , Link as MLink
} from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { register } from '../service/UserService'
import React, { useState } from 'react';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles'
import {
  useHistory
} from "react-router-dom";
import { useSnackbar } from 'notistack'

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



const RegisterComponent = () => {
  let history = useHistory()

  const classes = useStyles()
  const [dialogOpen, setDialogOpen] = useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const { enqueueSnackbar } = useSnackbar();

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false
    },
    validationSchema: yup.object({
      email: yup.string()
        .email('Enter a valid email')
        .required('Email is required'),
      password: yup.string()
        .min(8, 'Password should be of minimum 8 characters length')
        .required('Password is required'),
      acceptTerms: yup.bool().oneOf([true], 'Accept Terms & Conditions is required'),
      confirmPassword: yup.string()
        .min(8, 'Password should be of minimum 8 characters length')
        .required('Confirm Password is required')
        .oneOf([yup.ref("password")], "Password does not match"),

    }),
    onSubmit: (values) => {
      (async () => {
        try {
          let { email, password } = values
          await register({ email, password })
          history.push('/login')
        } catch (error) {
          console.log(error)
          enqueueSnackbar(error.response.data.message, { variant: 'error' })
        }
      })()
    },
  })


  function openConsent() {
    setDialogOpen(true)
  }
  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
          </Typography>
        <form className={classes.form} noValidate onSubmit={formik.handleSubmit} >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                value={formik.values.email}
                autoComplete="email"
                onChange={formik.handleChange}
                error={formik.touched.email && !!(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
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
            </Grid>

            <Grid item xs={12}>
              <TextField
                name="confirmPassword"
                variant="outlined"
                required
                fullWidth
                id="confirmPassword"
                label="Confirm Password"
                type="password"
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                error={formik.touched.confirmPassword && !!(formik.errors.confirmPassword)}
                helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
              />
            </Grid>
            <Grid item xs={12}>
              <Checkbox name="acceptTerms" color="primary" onChange={() => formik.values.acceptTerms = !formik.values.acceptTerms} />
              <MLink onClick={openConsent} >I Agree for the  term of use</MLink>
              {(formik.touched.acceptTerms && formik.errors.acceptTerms) && <FormHelperText error={true} >{formik.errors.acceptTerms}</FormHelperText>}
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Sign Up
            </Button>

          <Button
            type="button"
            fullWidth
            variant="contained"
            color="secondary"
            className={classes.submit}
            onClick={() => history.push("/")}
          >

            Sign in
        </Button>
        </form>
      </div>
      <Dialog
        fullScreen={fullScreen}
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false)
        }}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">Term of use</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vel condimentum urna, faucibus ullamcorper mauris. Donec ultrices risus sit amet dapibus bibendum. Ut bibendum massa at pulvinar fringilla. Phasellus urna felis, vulputate vitae pharetra et, commodo vel odio. Mauris tincidunt gravida libero, eget eleifend tellus elementum id. Praesent eget sapien fringilla, tempor risus viverra, faucibus eros. Vivamus a sollicitudin leo. Nam ut odio condimentum, dignissim ligula nec, ornare urna. Nunc nulla quam, ullamcorper ac lobortis quis, ultricies eget massa. Phasellus a nisl ullamcorper, sagittis diam at, tincidunt nibh. Integer hendrerit egestas lorem, ac pharetra mi pulvinar a. Phasellus imperdiet lorem rutrum volutpat imperdiet.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setDialogOpen(false)
          }} color="primary" autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>




    </Container>
  )

}

export default RegisterComponent