    import './Map.css';
    import { v4 as uuid } from 'uuid';
    import { IPMarker } from '../../shared/SharedTypes';
    import { useSession } from '@inrupt/solid-ui-react';
    import { MarkerContext, Types } from '../../context/MarkerContextProvider';
    import React, { useEffect, useRef, useState, useContext, MutableRefObject } from 'react';
    import { notify } from 'reapop';
    import { useTranslation } from 'react-i18next';

    interface IMarker {
        name: string;
        address: string;
        category: string;
        description: string;
        latLng: GoogleLatLng;
    }

    interface ICouple {
        marker: GoogleMarker;
        //infoWindow: GoogleInfoWindow;
    }

    type GoogleMap = google.maps.Map;
    type GoogleLatLng = google.maps.LatLng;
    type GoogleMarker = google.maps.Marker;

    interface IMapProps {
        globalLat: number;
        globalLng: number;
        globalName: string;
        globalMode: string;
        globalAddress: string;
        globalCategory: string;
        acceptedMarker: boolean;
        globalFilterName: string;
        mapTypeControl?: boolean;
        globalDescription: string;
        mapType: google.maps.MapTypeId;
        globalFilterCategories: string[];
        nextID: MutableRefObject<string>;
        friendsMap: boolean;
        isNewUbiOpen: boolean;
        setGlobalLat: (globalLat: number) => void;
        setGlobalLng: (globalLng: number) => void;
        setMarkerShown: (marker: IPMarker) => void;
        setDetailedIWOpen: (open: boolean) => void;
        setGlobalAddress: (globalAddress: string) => void;
        setAcceptedMarker: (acceptedMarker: boolean) => void;
        setFriendsMap: (friendsMap: boolean) => void;
        notify: () => void;
    }

    // Aclaración: los comentarios en los useEffect deshabilitan warnings.
    // Elegí esta opción pues intentar solucionarlos solo llevaría a
    // quebraderos de cabeza y/o bucles infinitos, lo que se escapa
    // del ámbito de esta asignatura.

const LoMap: React.FC<IMapProps> = (props) => {
    const { session } = useSession();
    const ref = useRef<HTMLDivElement>(null);                               // Contenedor HTML del mapa
    const [map, setMap] = useState<GoogleMap>();                            // useState para conservar la referencia al mapa
    const [marker, setMarker] = useState<IMarker>();                        // useState para comunicar el listener con el método
    const listenerRef = useRef<google.maps.MapsEventListener>();
    const { state: markers, dispatch } = useContext(MarkerContext);         // Proveedor de los marcadores en el POD
    const [lastAddedCouple, setLastAddedCouple] = useState<ICouple>();      // Último par (marcador, ventana de información) añadidos al mapa
    const [googleMarkers, setGoogleMarkers] = useState<GoogleMarker[]>([]); // useState para conservar referencias a todos los marcadores que se crean
    const [isLoaded, setLoaded] = useState<boolean>(false);
    const DEFAULT_MAP_ZOOM = 15;
    const { t } = useTranslation("translation");

        /**
         * Inicia y/o inicializa el mapa
         */
        const startMap = (): void => {
            if (!map) {
                defaultMapStart();           // Si el mapa no está iniciado, lo inicia
            } else {
                google.maps.event.addListenerOnce(map, 'idle', function(){
                    // do something only the first time the map is loaded
                  setLoaded(true);
                    
                });

                if (session.info.isLoggedIn) {
                    addInitMarker();                // Añade un marcador para evitar problemas con los Spinner del formulario
                    initEventListener();            // Inicia el listener encargado de escuchar clicks en el mapa
                }
                addHomeMarker(map.getCenter()); // Añade un marcador en la posición actual del usuario
            }
        };

        /**
         * UseEffect encargado de iniciar y/o inicializar el mapa
         */
        useEffect(() => {
            startMap();
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [map]);

        /**
         * Intenta conseguir la posición del usuario para iniciar y centrar el mapa en dicha posición
         */
        const defaultMapStart = (): void => {
            
            const defaultAddress = new google.maps.LatLng(43.5276892, -5.6355573);  // Posición por defecto en caso de problemas
            if (navigator.geolocation) {                                            // Si se puede usar la geolocalización
                navigator.geolocation.getCurrentPosition(({ coords }) => {

                    initMap(DEFAULT_MAP_ZOOM, new google.maps.LatLng(coords.latitude, coords.longitude))

                }, () => {                                                          // En caso de error
                    initMap(DEFAULT_MAP_ZOOM, defaultAddress);
                })
            } else {
                initMap(DEFAULT_MAP_ZOOM, defaultAddress);
            }
        };

        /**
         * Inicia el listener encargado de escuchar clicks en el mapa
         */
        const initEventListener = (): void => {
            
            listenerRef.current = google.maps.event.addListener(map!, 'click', async function (e) { // Una vez se recibe un click...
                props.setGlobalLat(e.latLng.lat());                           // Cambio las coordenadas en los campos del formulario
                props.setGlobalLng(e.latLng.lng());
                
                setMarker({                                                   // Y actualizo el useState "marker"
                    address: "",
                    latLng: e.latLng,
                    name: "Placeholder nombre",                               // Placeholders para evitar problemas al acceder a los campos del formulario
                    category: "Placeholder categoría",
                    description: "Placeholder descripción"
                })
            })            
        };

        session.onLogout(() => {
            lastAddedCouple?.marker.setMap(null);
            google.maps.event.removeListener(listenerRef.current!);
        });

        /**
         * UseEffect encargado de añadir un marcador cuando se actualiza el useState "marker"
         */
        useEffect(() => {
            if (marker) {
                marker.name = formatName(); // Ahora sí, accede a los campos del formulario
                marker.category = props.globalCategory;
                marker.description = formatDescription();

                addMarker(marker);          // Añade un marcador
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [marker]);

        /**
         * Devuelve un nombre, si el campo del formulario está relleno
         * @returns string nombre
         */
        const formatName = (): string => {
            return props.globalName ? props.globalName : t("MapView.noname");
        }

        /**
         * Devuelve una descripción, si el campo del formulario está relleno
         * @returns string descripción
         */
        const formatDescription = (): string => {
            return props.globalDescription ? props.globalDescription : t("MapView.nodescp");
        }

        /**
         * Añade un marcador al mapa
         * @param iMarker parámetros del marcador a añadir
         */
        const addMarker = (iMarker: IMarker): void => {
            if (lastAddedCouple) {
                lastAddedCouple.marker.setMap(null);                            // Elimina del mapa el último marcador añadido
            }

            setLastAddedCouple(generateMarker(iMarker, props.nextID.current));    // Genera un par (marcador, ventana de información) y actualiza el useState correspondiente
        };

        /**
         * Genera un par (marcador, ventana de información)
         * @param notAddedMarker parámetros del marcador a añadir 
         * @param id id del marcador correspondiente en el POD 
         * @returns ICouple par(marcador, ventana de información) 
         */
        const generateMarker = (notAddedMarker: IMarker, id: string): ICouple => {
            const icon = {
                url: "marker.png",
                scaledSize: new google.maps.Size(35,35),
            }
            const marker: GoogleMarker = new google.maps.Marker({
                position: notAddedMarker.latLng,                             // Posición del marcador
                icon: icon,                                     // Icono del marcador
                map: map                                                     // Referencia al mapa
            });

            marker.addListener('click', () => {                              // Cuando hago click en el marcador...
                //infoWindow.open(map, marker);                                // Abro la ventana de información correspondiente.

                let detailedMarker = markers.find(marker => marker.id === id);
                if (detailedMarker) {
                    props.setMarkerShown(detailedMarker);
                    props.setDetailedIWOpen(true);
                }
            });

            marker.addListener('rightclick', () => {
                if (!props.friendsMap) {
                    if (markers.find(marker => marker.id === id)) {
                        props.setDetailedIWOpen(false);

                        marker.setMap(null);
                        dispatch({ type: Types.DELETE_MARKER, payload: { id: id } });
                    }
                    props.notify();
                } else {
                    notify(t("MapView.errorDel"), "error");
                }
            });

            setGoogleMarkers(googleMarkers => [...googleMarkers, marker]);   // Actualizo el useState para conservar su referencia

            return { marker };
        }

        /**
         * Añade un marcador; al hacer click, el mapa se centra en él.
         * @param location coordenadas del marcador
         */
        const addHomeMarker = (location: GoogleLatLng): void => {
            const icon = {
                url: "home.png",
                scaledSize: new google.maps.Size(45,45),
            }
            const homeMarkerConst: GoogleMarker = new google.maps.Marker({ // Mismo proceso que en generateMarker()
                icon: icon,
                position: location,
                map: map
            });

            homeMarkerConst.addListener('click', () => {                   // Cuando hago click en el marcador...
                map?.panTo(location);                                      // Centro el mapa en el marcador
                map?.setZoom(DEFAULT_MAP_ZOOM);                                           // Aumento el zoom
            });
        };

        /**
         * Crea un marcador con las mismas características que el último marcador generado
         */
        const addInitMarker = (): void => {
            setMarker({
                name: "Placeholder nombre",
                address: props.globalAddress,
                category: "Placeholder categoría",
                description: "Placeholder descripción",
                latLng: new google.maps.LatLng(props.globalLat, props.globalLng)
            })
        }

        /**
         * UseEffect encargado de actualizar el último marcador añadido cuando se cambian
         * las coordenadas en el formulario
         */
        useEffect(() => {
            let location = new google.maps.LatLng(props.globalLat, props.globalLng);        // Accedo a los campos del formulario
            
            coordinateToAddress(location).then(address => props.setGlobalAddress(address)); // Actualizado la dirección del marcador

            if (lastAddedCouple) {
                lastAddedCouple.marker.setPosition(location);                               // Cambio su posición
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [props.globalLat, props.globalLng]);

        /**
         * Función auxiliar para evitar tener que guardar referencias
         * a los listener del último marcador
         */
        const updateMarkerListeners = () => {
            let updatedMarker = markers.find(marker => marker.id === props.nextID.current)!; // Toma su versión persistente
            generateMarker(parseMarker(updatedMarker), updatedMarker.id);                    // La añade al mapa
            props.nextID.current = uuid();                                             // Actualiza el próximo ID a utilizar

            lastAddedCouple?.marker.setMap(null);                                            // Borra su versión obsoleta del mapa
        }

        /**
         * UseEffect atento a la propiedad "marcador aceptado"
         */
        useEffect(() => {
            if (lastAddedCouple && props.acceptedMarker) {
                updateMarkerListeners();                                    // Debemos actualizar sus listener, pues hacen referencia a valores antiguos...

                lastAddedCouple.marker = new google.maps.Marker();          // Corta la referencia al último marcador añadido

                props.setAcceptedMarker(false);                             // Cambia el useState a false

                addInitMarker();                                            // Añade un marcador en su posición para evitar problemas con los Spinner
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [props.acceptedMarker]);

        /**
         * UseEffect encargado de cambiar los marcadores del mapa 
         * en función de la opción seleccionada
         */
        useEffect(() => {
            deleteAllMarkers(); // Borra todos los marcadores del mapa

            switch (props.globalMode) {
                case 'M':
                    loadContext(); // Carga los marcadores del contexto
                    break;
                case 'A':
                    loadFriendMarkers();
                    break;
                case 'E':
                    break;
                default:
            }

            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [props.globalMode, props.globalFilterName, props.globalFilterCategories, isLoaded]);

        /**
         * Borra todos los marcadores del mapa y vacía el useState correspondiente
         */
        const deleteAllMarkers = (): void => {
            googleMarkers.forEach((googleMarker) => {
                if (googleMarker !== lastAddedCouple?.marker) {  // Si el marcador no es el último que se ha añadido...
                    googleMarker.setMap(null);                   // Lo borra
                }
            });

            setGoogleMarkers([]);
        }

        /**
         * Carga los marcadores del contexto
         */
        const loadContext = (): void => {
            markers.filter(m => m.webId === session.info.webId!
                && props.globalFilterCategories.includes(m.category)
                && m.name.includes(props.globalFilterName)).forEach((marker) => {
                    generateMarker(parseMarker(marker), marker.id); // Lo parsea y lo añade al mapa
                })
        }

        const loadFriendMarkers = (): void => {
            markers.filter(m => m.webId !== session.info.webId!
                && props.globalFilterCategories.includes(m.category)
                && m.name.includes(props.globalFilterName)).forEach((marker) => {
                    generateMarker(parseMarker(marker), marker.id); // Lo parsea y lo añade al mapa
                })
        }

    /**
     * Transforma la versión persistente de un marcador 
     * a su versión correspondiente en el mapa
     * @param iPMarker marcador persistente
     * @returns parámetros necesarios para generar un marcador
     */
    const parseMarker = (iPMarker: IPMarker): IMarker => {
        return {
            name: iPMarker.name,
            address: iPMarker.address,
            category: iPMarker.category,
            description: iPMarker.description,
            latLng: new google.maps.LatLng(iPMarker.lat, iPMarker.lng)
        };
    }

        /**
         * Usa geolocalización inversa para obtener la dirección de unas coordenadas
         * @param coordinate coordenadas
         * @returns dirección formateada
         */
        const coordinateToAddress = (coordinate: GoogleLatLng): Promise<string> => {
            const geocoder = new google.maps.Geocoder();
            return new Promise((resolve, reject) => {
                geocoder.geocode(
                    {
                        location: coordinate
                    },
                    (results, status) => {
                        if (status === google.maps.GeocoderStatus.OK) {                     // Si se obtienen resultados...
                            const formatedAddress = results[0].formatted_address;           // Retorna el primero
                            resolve(formatedAddress);
                        } else if (status === google.maps.GeocoderStatus.ZERO_RESULTS) {    // Si no se obtienen resultados...
                            const formatedAddress = "Sin resultados";
                            resolve(formatedAddress);
                        } else {                                                            // Si se produce un error...
                            reject(new Error(status));
                        }
                    }
                )
            })
        };

        /**
         * Inicia el mapa
         * @param zoomLevel zoom inicial
         * @param address dirección en la que centrar el mapa
         */
        const initMap = (zoomLevel: number, address: GoogleLatLng): void => {
            if (ref.current) {
                setMap(
                    new google.maps.Map(ref.current, {
                        zoom: zoomLevel,
                        center: address,
                        panControl: false,
                        zoomControl: true,
                        scaleControl: true,
                        rotateControl: false,
                        mapTypeId: props.mapType,
                        streetViewControl: false,
                        fullscreenControl: false,
                        draggableCursor: 'pointer',
                        gestureHandling: 'cooperative',
                        mapTypeControl: props.mapTypeControl,
                        clickableIcons: false,
                        styles: [
                            { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
                            { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
                            { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
                            {
                              featureType: "administrative.locality",
                              elementType: "labels.text.fill",
                              stylers: [{ color: "#d59563" }],
                            },
                            {
                              featureType: "poi",
                              stylers: [{visibility: 'off'}],
                            },
                            {
                              featureType: "road",
                              elementType: "geometry",
                              stylers: [{ color: "#38414e" }],
                            },
                            {
                              featureType: "road",
                              elementType: "geometry.stroke",
                              stylers: [{ color: "#212a37" }],
                            },
                            {
                              featureType: "road",
                              elementType: "labels.text.fill",
                              stylers: [{ color: "#9ca5b3" }],
                            },
                            {
                              featureType: "road.highway",
                              elementType: "geometry",
                              stylers: [{ visibility: 'off' }],
                            },
                            {
                              featureType: "road.highway",
                              elementType: "geometry.stroke",
                              stylers: [{ visibility: 'off' }],
                            },
                            {
                              featureType: "road.highway",
                              elementType: "labels.text.fill",
                              stylers: [{ visibility: 'off' }],
                            },
                            {
                              featureType: "transit",
                              elementType: "geometry",
                              stylers: [{ color: "#2f3948" }],
                            },
                            {
                              featureType: "transit.station",
                              elementType: "labels.text.fill",
                              stylers: [{ color: "#d59563" }],
                            },
                            {
                              featureType: "water",
                              elementType: "geometry",
                              stylers: [{ color: "#17263c" }],
                            },
                            {
                              featureType: "water",
                              elementType: "labels.text.fill",
                              stylers: [{ color: "#515c6d" }],
                            },
                            {
                              featureType: "water",
                              elementType: "labels.text.stroke",
                              stylers: [{ color: "#17263c" }],
                            },
                          ],
                    })
                );
            }
        };

        return (
                <div ref={ref} className="map" style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    <img src="loading-gif2.gif" alt="loading-map" style={{display: 'block'}}/>
                </div>
        );
    };

    export default LoMap;