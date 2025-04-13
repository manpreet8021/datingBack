import React, { useRef, useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { useDispatch, useSelector } from 'react-redux';
import { setEventLocation } from '../../store/slice/eventSlice';

const MapViewComponent = () => {
	const dispatch = useDispatch()
	const mapRef = useRef(null);
	const [markerPosition, setMarkerPosition] = useState(null);
	const auth = useSelector(state => state.auth)
	const event = useSelector(state => state.event)

	const handlePlaceSelect = (data, details) => {
		const { lat, lng } = details.geometry.location;
		const coords = {
			latitude: lat,
			longitude: lng,
		};

		dispatch(setEventLocation(coords))

		setMarkerPosition(coords);
		mapRef.current.animateToRegion({
			...coords,
			latitudeDelta: 0.01,
			longitudeDelta: 0.01,
		}, 1000);
	};

	return (
		<View style={styles.container}>
			<GooglePlacesAutocomplete
				placeholder="Search for a place"
				fetchDetails={true}
				onPress={handlePlaceSelect}
				debounce={500}
				onFail={(error) => {
					console.error("Google Places Autocomplete Error:", error);
				}}
				query={{
					key: 'AIzaSyAnSYnvCWqTeFhXEO3RXNZgatf9Ij4eFxM',
					language: 'en',
				}}
				styles={{
					container: styles.searchContainer,
					textInput: styles.textInput,
					listView: styles.listView,
				}}

			/>

			<MapView
				ref={mapRef}
				style={styles.map}
				initialRegion={{
					latitude: event.AddEventLocation.latitude || auth.location.latitude,
					longitude: event.AddEventLocation.longitude || auth.location.longitude,
					latitudeDelta: 0.05,
					longitudeDelta: 0.05,
				}}
			>
				{markerPosition && (
					<Marker coordinate={markerPosition} />
				)}
			</MapView>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	searchContainer: {
		position: 'absolute',
		width: '100%',
		zIndex: 1,
		paddingTop: 10,
		backgroundColor: 'transparent',
	},
	textInput: {
		height: 50,
		marginHorizontal: 10,
		borderRadius: 8,
		backgroundColor: '#fff',
		paddingHorizontal: 15,
		fontSize: 16,
	},
	listView: {
		backgroundColor: 'white',
		marginHorizontal: 10,
	},
	map: {
		width: Dimensions.get('window').width,
		height: '100%',
	},
});

export default MapViewComponent;