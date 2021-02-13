
import { makeStyles } from '@material-ui/core/styles';
import {
    TextField, Container, Button, Chip
    , Typography, CardActions, CardMedia, CardContent, Card, Tooltip, Fab,
    Link as MLink
} from '@material-ui/core';
import { PartyResponse } from '../service/PartyService'

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
type PartyProp = {
    party: PartyResponse
    onSubscribe: Function
}
const PartyComponent = ({ party, onSubscribe }: PartyProp) => {

    const classes = useStyles();

    const StatusChip = ({ p }: { p: PartyResponse }) => {

        if (p.is_owner) {
            return <Chip label="owned" color="primary" />
        } else if (p.is_join) {
            return <Chip label="Joined" color="secondary"/>
        } else {
            return <></>
        }

    }
    return (
        <Card className={classes.card}   >
            <CardMedia
                className={classes.cardMedia}
                image="https://source.unsplash.com/random"
                title="Image title"
            />
            <CardContent className={classes.cardContent} >
                <Typography gutterBottom variant="h5" component="h2">
                    {party.name} <span>({party.current_size}/{party.size})</span>
                </Typography>
                <Typography>
                    {party.name}
                </Typography>
            </CardContent>
            { (!party.is_owner && !party.is_join) &&
                <CardActions>
                    <Button size="small" onClick={() => onSubscribe(party.id)} color="primary">
                        Join
                </Button>
                </CardActions>
            }
            <CardActions>
                <StatusChip p={party} />
            </CardActions>
        </Card>)


}

export default PartyComponent