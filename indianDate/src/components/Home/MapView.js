import React, { useRef, useState } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, Text } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { setEventLocation } from '../../store/slice/eventSlice';
import { colors } from '../../themes';
import strings from '../../i18n/strings';
import FButton from '../common/FButton';

const MapViewComponent = ({ location, setMapViewVisible, setFieldValue, latitude, longitude }) => {
	const mapRef = useRef(null);
	const [markerPosition, setMarkerPosition] = useState({
		latitude: latitude,
		longitude: longitude
	});


	const handlePlaceSelect = (data, details) => {
		const { lat, lng } = details.geometry.location;
		const coords = {
			latitude: lat,
			longitude: lng,
		};
		setFieldValue('latitude', coords.latitude)
		setFieldValue('longitude', coords.longitude)
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
				debounce={1000}
				onFail={(error) => {
					console.error("Google Places Autocomplete Error:", error);
				}}
				query={{
					key: 'AIzaSyDRbNA-mlGlnDi2TsJZjbMM_WLTXlPA_qc',
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
					latitude: location.latitude,
					longitude: location.longitude,
					latitudeDelta: 0.05,
					longitudeDelta: 0.05,
				}}
				provider={PROVIDER_GOOGLE}
				onPress={(e) => {
					const newLocation = {
						latitude: e.nativeEvent?.coordinate.latitude,
						longitude: e.nativeEvent?.coordinate.longitude,
					}
					setFieldValue('latitude',newLocation.latitude)
					setFieldValue('longitude',newLocation.longitude)
					setMarkerPosition(newLocation)
				}}
			>
				{ latitude && longitude && (<Marker coordinate={markerPosition} />)}
			</MapView>
			<View style={styles.doneButton}>
				<FButton
					title={strings.done}
					color={colors.white}
					containerStyle={styles.doneButtonText}
					onPress={() => {
						setMapViewVisible(false)
					}}
				/>
			</View>
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
		width: '100%',
		height: '100%',
	},
	doneButton: {
		position: 'absolute',
		bottom: 60,
		alignSelf: 'flex-end',
	},
	doneButtonText: {
		width: '80%',
	},
});

export default MapViewComponent;