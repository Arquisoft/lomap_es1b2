import { Close } from '@mui/icons-material';
import { useSession } from '@inrupt/solid-ui-react';
import { Comment, IPMarker } from "../../../shared/SharedTypes";
import React, { useContext, useEffect, useState } from 'react';
import { MarkerContext, Types } from '../../../context/MarkerContextProvider';
import { deletePublicMarker, savePublicMarker } from '../../../helpers/SolidHelper';
import { Slide, Stack, TextField, Dialog, Rating, Button, IconButton, FormGroup, Switch, FormControlLabel, Input, TextareaAutosize, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import Resizer from "react-image-file-resizer";

import { notify } from 'reapop';

interface DetailedUbicationViewProps {
  markerShown: IPMarker;
  isDetailedIWOpen: boolean;
  setMarkerShown: (detailedMarker: IPMarker) => void;
  setDetailedIWOpen: (detailedMarkerOpened: boolean) => void;
}

const DetailedUbicationView: React.FC<DetailedUbicationViewProps> = (props) => {
  const { session } = useSession();
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<Comment>();
  const [isPublic, setPublic] = useState<boolean>(false);
  const { state: markers, dispatch } = useContext(MarkerContext);
  const [isRatingOpen, setRatingOpen] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<string>();

  const { t } = useTranslation("translation");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let marker = markers.find(marker => marker.id = props.markerShown.id)!;
    marker.ratings.push(rating);
    marker.comments.push(comment!);

    dispatch({ type: Types.UPDATE_MARKER, payload: { id: marker.id, marker: marker } });
    if (marker.webId !== session.info.webId!) {
      await savePublicMarker(marker, marker.webId);
    }

    restartValoration();
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const fileBaseImg = await fileToBase64(file);
      console.log(fileBaseImg);
      setSelectedImage(fileBaseImg!);
    }
  };

  const restartValoration = () => {
    setRatingOpen(false);
    setComment(undefined);
    setRating(0);
    setSelectedImage(undefined);
  }

  const getRatingMean = () => {
    let sum = props.markerShown.ratings
      .map(n => parseInt(n.toString()))
      .reduce((previous, current) => current += previous, 0);
    let total = props.markerShown.ratings.length;
    let result = sum / total;

    return result;
  }

  // Convierte un File a un string en base64
  const fileToBase64 = async (file: File): Promise<string | null> => {
    return await new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          const base64String = reader.result;
          // Get the file size in bytes
          const fileSize = Math.round((base64String.length * 3) / 4);
          // If the file size is already less than 1MB, return the base64 string
          if (fileSize < 1000000) {
            return resolve(base64String);
          }
          // Otherwise, resize the image and reduce its quality using react-image-file-resizer
          Resizer.imageFileResizer(
            file,
            600, // Width
            600, // Height
            'JPEG', // Format
            80, // Quality
            0, // Rotation
            (uri) => {
              return resolve(uri as string);
            },
            'base64' // Output type
          );
        }
      };

      reader.onload = () => {
          if (typeof reader.result === 'string') return resolve(reader.result)
      }
      reader.onerror = (error) => reject(error)
    })
  }

  useEffect(() => {
    setPublic(props.markerShown.isPublic);
  }, [props.markerShown]);

  useEffect(() => {
    let id = props.markerShown.id;

    if (id !== "") {
      let marker = markers.find(marker => marker.id = id)!;

      marker.isPublic = isPublic;
      if (isPublic) {
        savePublicMarker(marker, session.info.webId!);
      } else {
        deletePublicMarker(marker, session.info.webId!);
      }
      dispatch({ type: Types.UPDATE_MARKER, payload: { id: marker.id, marker: marker } });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPublic]);

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
          {props.markerShown.webId === session.info.webId
            &&
            <FormGroup>
              <FormControlLabel control={
                <Switch
                  checked={isPublic}
                  inputProps={{ 'aria-label': 'controlled' }}
                  onChange={e => setPublic(e.target.checked)}
                />
              }
                sx={{ color: 'white', my: 2 }} label={t("DetailedInfo.share")} />
            </FormGroup>
          }
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
                  <li key={comment.text+Math.random()*100}>
                    {comment.text}{comment.img && <img src={comment.img} alt="pruebas" height={80} style={{display: 'block'}} />}
                    {console.log(comment.img)}
                  </li>
                )}
              </ul>
            </Box>
            <Button variant="outlined" 
                sx={{ my: 2, color:'lightblue', border: '2px solid', position: 'absolute', bottom: '0' ,marginBottom: '1%'  }} onClick={() => setRatingOpen(true)}>
                  {t("DetailedInfo.write")}
            </Button>
          </Box>
          <Dialog onClose={() => setRatingOpen(false)} open={isRatingOpen}>
            <form name="newRating" onSubmit={handleSubmit}>
              <Stack direction='column' sx={{ width: '30em', padding: '1em' }}>
                <Stack direction='row'>
                  <h1 style={{ margin: '0' }}>{t("DetailedInfo.rate")}</h1>
                  <IconButton sx={{ marginLeft: 'auto', marginRight: '0em' }} onClick={async () => setRatingOpen(false)}><Close /></IconButton>
                </Stack>
                <Rating
                  value={rating}
                  name="rating"
                  sx={{ margin: '0.5em 0em 0.5em' }}
                  onChange={(_, value) => setRating(value as unknown as number)}
                />
                <TextField
                  rows={4}
                  required
                  multiline
                  value={comment?.text}
                  name="comment"
                  label={t("DetailedInfo.comment")}
                  onChange={(e) => setComment({
                    text: e.target.value,
                    img: selectedImage
                  })}
                  sx={{ margin: '0.5em 0em 0.5em' }}
                />
                <Input
                  type='file'
                  onChange={handleImageUpload}
                 />
                <Button variant="contained" type="submit" 
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
