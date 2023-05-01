import { Close } from '@mui/icons-material';
import { useSession } from '@inrupt/solid-ui-react';
import { Comment, IPMarker } from "../../../shared/SharedTypes";
import React, { useContext, useState } from 'react';
import { MarkerContext, Types } from '../../../context/MarkerContextProvider';
import { Slide, Stack, TextField, Dialog, Rating, Button, IconButton, Input, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { notify } from 'reapop';
import { fileUpload } from '../../../helpers/CloudinaryHelper';
import { savePublicMarker } from '../../../helpers/SolidHelper';

interface DetailedUbicationViewProps {
  markerShown: IPMarker;
  isDetailedIWOpen: boolean;
  rating?: number;
  setMarkerShown: (detailedMarker: IPMarker) => void;
  setDetailedIWOpen: (detailedMarkerOpened: boolean) => void;
}

const DetailedUbicationView: React.FC<DetailedUbicationViewProps> = (props) => {
  const { session } = useSession();
  const [rating, setRating] = useState<number>(props.rating === undefined ? 0 : props.rating);
  const [comment, setComment] = useState<Comment>();
  const [text, setText] = useState<string>('');
  const { state: markers, dispatch } = useContext(MarkerContext);
  const [isRatingOpen, setRatingOpen] = useState<boolean>(false);
  const [urlImage, setUrlImage] = useState<string>();
  const [author, setAuthor] = useState(session.info.webId?.substring(8).split('.')[0]!)

  const { t } = useTranslation("translation");
    
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newComment = {
      author: author,
      text: text,
      img: urlImage
    }

    setComment(newComment)
    let marker = markers.find(marker => marker.id = props.markerShown.id)!;
    marker.ratings.push(rating);
    marker.comments.push(newComment!);
    console.log(marker.owner)
    console.log(marker.webId)


    dispatch({ type: Types.UPDATE_MARKER, payload: { id: marker.id, marker: marker } });
    notify(t("DetailedInfo.addR"), 'success')
    if (marker.webId !== session.info.webId!) {
      await savePublicMarker(marker, marker.owner);
    }

    restartValoration();
  }

  const handleImageUpload = async (e:any) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = await fileUpload(file);
      if (url) setUrlImage(url);
    }
  };

  const restartValoration = () => {
    setRatingOpen(false);
    setComment(undefined);
    setRating(0);
    setText('');
    setUrlImage(undefined);
  }

  const getRatingMean = () => {
    let sum = props.markerShown.ratings
      .map(n => parseInt(n.toString()))
      .reduce((previous, current) => current += previous, 0);
    let total = props.markerShown.ratings.length;
    let result = sum / total;

    return result;
  }

  return (
    <>
      <Slide style={{ color: 'white' }} direction="right" in={props.isDetailedIWOpen} mountOnEnter unmountOnExit>
        <Stack alignItems="right" sx={{ margin: 2, display: props.isDetailedIWOpen ? '' : 'none' }}>
          <Stack direction='row' >
            <h1 style={{ marginTop: '0em' }}>{props.markerShown.name}</h1>
            <IconButton sx={{ marginLeft: 'auto', marginRight: '0em' }} onClick={async () => props.setDetailedIWOpen(false)}><Close /></IconButton>
          </Stack>
          <p style={{ marginTop: '0em' }}><strong>{t("DetailedInfo.created")}</strong>{props.markerShown.owner || t("DetailedInfo.owner")}</p>
          <p><strong>{t("DetailedInfo.dir")}</strong>{props.markerShown.address}</p>
          <p><strong>{t("DetailedInfo.cat")}</strong>{props.markerShown.category}</p>
          <p><strong>{t("DetailedInfo.descp")}</strong>{props.markerShown.description}</p>
          <>
            {props.markerShown.webId === session.info.webId}
          </>
          <h2>{t("DetailedInfo.summary")}</h2>
          <Rating value={getRatingMean()} readOnly />
          <Box>
            <Box 
              maxHeight={'270px'}
              maxWidth={'400px'}
              sx={{ 
                overflowY: "scroll"
              }}>
              <ul>
                {props.markerShown.comments.map((comment) =>
                  <li style={{"marginBottom": "1rem"}} key={comment?.text+Math.random()*100}>
                    {comment.author + ": " + comment.text}{comment.img && <img src={comment.img} alt="pruebas" height={80} style={{display: 'block'}} />}
                  </li>
                )}
              </ul>
            </Box>
            <Button variant="outlined" data-testid="button-open"
                sx={{ my: 2, color:'lightblue', border: '2px solid', position: 'absolute', bottom: '0' ,marginBottom: '1%'  }} onClick={() => setRatingOpen(true)}>
                  {t("DetailedInfo.write")}
            </Button>
          </Box>
          <Dialog onClose={() => setRatingOpen(false)} open={isRatingOpen}>
            <form name="newRating" onSubmit={handleSubmit}>
              <Stack direction='column' sx={{ width: '30em', padding: '1em' }}>
                <Stack direction='row'>
                  <h1 style={{ margin: '0' }}>{t("DetailedInfo.rate")}</h1>
                  <IconButton sx={{ marginLeft: 'auto', marginRight: '0em'}} onClick={async () => setRatingOpen(false)}><Close /></IconButton>
                </Stack>
                <Rating
                  value={rating}
                  name="rating"
                  role="rating"
                  sx={{ margin: '0.5em 0em 0.5em' }}
                  onChange={(_, value) => setRating(value as unknown as number)}
                />
                <TextField
                  rows={4}
                  multiline
                  value={comment?.text}
                  name="comment"
                  inputProps={{ "data-testid": "input-comment" }}
                  label={t("DetailedInfo.comment")}
                  onChange={(e) => setText(e.target.value)}
                  sx={{ margin: '0.5em 0em 0.5em' }}
                />
                <Input
                  type='file'
                  onChange={
                    handleImageUpload              
                  }
                  inputProps={{accept:"image/png, image/jpeg, image/jpg" }}
                 />
                <Button variant="contained" type="submit" data-testid="button-submit"
                sx={{ marginTop: '0.5em', color:'lightblue', border: '2px solid'}}>
                  {t("DetailedInfo.acept")} 
                </Button>
              </Stack>
            </form>
          </Dialog>
        </Stack>
      </Slide>
    </>
  );
}

export default DetailedUbicationView;
