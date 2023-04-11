    import './Map.css';
    import { v4 as uuid } from 'uuid';
    import { IPMarker } from '../../shared/SharedTypes';
    import { useSession } from '@inrupt/solid-ui-react';
    import { MarkerContext, Types } from '../../context/MarkerContextProvider';
    import React, { useEffect, useRef, useState, useContext, MutableRefObject } from 'react';

    interface IMarker {
        name: string;
        address: string;
        category: string;
        description: string;
        latLng: GoogleLatLng;
    }

interface ICouple {
    marker: GoogleMarker;
    infoWindow: GoogleInfoWindow;
}

    type GoogleMap = google.maps.Map;
    type GoogleLatLng = google.maps.LatLng;
    type GoogleMarker = google.maps.Marker;
    type GoogleInfoWindow = google.maps.InfoWindow;

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
        setGlobalLat: (globalLat: number) => void;
        setGlobalLng: (globalLng: number) => void;
        setMarkerShown: (marker: IPMarker) => void;
        setDetailedIWOpen: (open: boolean) => void;
        setGlobalAddress: (globalAddress: string) => void;
        setAcceptedMarker: (acceptedMarker: boolean) => void;
    }

    // Aclaración: los comentarios en los useEffect deshabilitan warnings.
    // Elegí esta opción pues intentar solucionarlos solo llevaría a
    // quebraderos de cabeza y/o bucles infinitos, lo que se escapa
    // del ámbito de esta asignatura.

const Map: React.FC<IMapProps> = (props) => {
    const { session } = useSession();
    const ref = useRef<HTMLDivElement>(null);                               // Contenedor HTML del mapa
    const [map, setMap] = useState<GoogleMap>();                            // useState para conservar la referencia al mapa
    const [marker, setMarker] = useState<IMarker>();                        // useState para comunicar el listener con el método
    const listenerRef = useRef<google.maps.MapsEventListener>();
    const { state: markers, dispatch } = useContext(MarkerContext);         // Proveedor de los marcadores en el POD
    const [lastAddedCouple, setLastAddedCouple] = useState<ICouple>();      // Último par (marcador, ventana de información) añadidos al mapa
    const [googleMarkers, setGoogleMarkers] = useState<GoogleMarker[]>([]); // useState para conservar referencias a todos los marcadores que se crean

        /**
         * Inicia y/o inicializa el mapa
         */
        const startMap = (): void => {
            if (!map) {
                defaultMapStart();              // Si el mapa no está iniciado, lo inicia
            } else {
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
                    initMap(4, new google.maps.LatLng(coords.latitude, coords.longitude))
                }, () => {                                                          // En caso de error
                    initMap(4, defaultAddress);
                })
            } else {
                initMap(4, defaultAddress);
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
            return props.globalName ? props.globalName : "Sin nombre";
        }

        /**
         * Devuelve una descripción, si el campo del formulario está relleno
         * @returns string descripción
         */
        const formatDescription = (): string => {
            return props.globalDescription ? props.globalDescription : "Sin descripción";
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
            const marker: GoogleMarker = new google.maps.Marker({
                position: notAddedMarker.latLng,                             // Posición del marcador
                icon: "blue_marker.png",                                     // Icono del marcador
                map: map                                                     // Referencia al mapa
            });

            // Empleo una función para crear el contenido de la ventana de información (¡¡¡pues solo admite HTML plano!!!)
            const infoWindow = new google.maps.InfoWindow({
                content: generateInfoWindowContent(notAddedMarker.name, notAddedMarker.category,
                    notAddedMarker.description, notAddedMarker.address)
            })

            marker.addListener('click', () => {                              // Cuando hago click en el marcador...
                infoWindow.open(map, marker);                                // Abro la ventana de información correspondiente.

                let detailedMarker = markers.find(marker => marker.id === id);
                if (detailedMarker) {
                    props.setMarkerShown(detailedMarker);
                    props.setDetailedIWOpen(true);
                }
            });

            marker.addListener('rightclick', () => {
                if (markers.find(marker => marker.id === id)) {
                    props.setDetailedIWOpen(false);

                    marker.setMap(null);
                    dispatch({ type: Types.DELETE_MARKER, payload: { id: id } });
                }
            });

            setGoogleMarkers(googleMarkers => [...googleMarkers, marker]);   // Actualizo el useState para conservar su referencia

            return { marker, infoWindow };
        }

        /**
         * Crea el string que contiene el HTML a incluir en la InfoWindow
         * @param name nombre del marcador
         * @param category categoría del marcador
         * @param description descripción del marcador
         * @param address dirección del marcador
         * @returns string que contiene el HTML a incluir en la InfoWindow
         */
        const generateInfoWindowContent = (name: string, category: string, description: string, address: string): string => {
            let result = ""

            result += `<h1>${name} (${category})</h1>`
            result += `<h2>${address}</h2>`
            result += `<p>${description}</p>`
            // result += `<button>Más info</button>`

            return result;
        }

        /**
         * Añade un marcador; al hacer click, el mapa se centra en él.
         * @param location coordenadas del marcador
         */
        const addHomeMarker = (location: GoogleLatLng): void => {
            const homeMarkerConst: GoogleMarker = new google.maps.Marker({ // Mismo proceso que en generateMarker()
                icon: "blue_marker.png",
                position: location,
                map: map
            });

            homeMarkerConst.addListener('click', () => {                   // Cuando hago click en el marcador...
                map?.panTo(location);                                      // Centro el mapa en el marcador
                map?.setZoom(6);                                           // Aumento el zoom
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
         * UseEffect encargado de actualizar el último marcador añadido cuando se cambian
         * sus propiedades en el formulariom o se modifica su dirección
         */
        useEffect(() => {
            if (lastAddedCouple) {
                lastAddedCouple.infoWindow.setContent(  // Modifica el contenido de su InfoWindow
                    generateInfoWindowContent(
                        formatName(),
                        props.globalCategory,
                        formatDescription(),
                        props.globalAddress
                    )
                );
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [props.globalName, props.globalDescription, props.globalCategory, props.globalAddress]);

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
                lastAddedCouple.infoWindow = new google.maps.InfoWindow();  // Corta la referencia a su ventana de información

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
                    // <- Cargar marcadores
                    break;
                default:
            }

            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [props.globalMode, props.globalFilterName, props.globalFilterCategories]);

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
                    })
                );
            }
        };

        return (
            <div ref={ref} className="map"></div>
        );
    };

    export default Map;