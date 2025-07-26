import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Linking
} from 'react-native';
import { useTranslation } from 'react-i18next'; // 1) import the hook

// Example color palette
const COLORS = {
  cardDark: '#1E293B',
  textLight: '#FFFFFF',
  textGray: '#CAD3F6',
  accent: '#7E97CE',
};

const AppointmentDetailsModal = ({
  visible,
  appointment,
  loading,
  onCancel,
  onClose,
}) => {
  // 2) Initialize the translation hook
  const { t } = useTranslation();

  // Destructure appointment data
  const { doctorName, specialty, rating, date, time, status, googleCalander } = appointment || {};
  // console.log({googleCalander,appointment})

  // 3) Use translation keys for text
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Doctor Info */}
          <Text style={styles.doctorName}>{doctorName}</Text>
          <Text style={styles.specialty}>{specialty}</Text>
          <Text style={styles.rating}>★ {rating}</Text>

          {/* Appointment Info */}
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>{t('date')}:</Text>
            <Text style={styles.infoValue}>{date}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>{t('time')}:</Text>
            <Text style={styles.infoValue}>{time}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>{t('status')}:</Text>
            <Text style={styles.infoValue}>
              {t(status)}
            </Text>
          </View>
         {googleCalander?.hangoutLink&& <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>{t('Online Meeting Link')}:</Text>
            <TouchableOpacity onPress={() => {
              Linking.openURL(googleCalander?.hangoutLink)
            }}>
              <Text style={{ ...styles.infoValue, textDecorationLine: "underline" }}>
                Join Now
              </Text>
            </TouchableOpacity>
          </View>}
          {/* Buttons */}
          <View style={styles.buttonContainer}>
            {/* Cancel Button */}
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onCancel}
              disabled={loading || status === 'canceled'}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>
                  {t('cancelAppointment')}
                </Text>
              )}
            </TouchableOpacity>

            {/* Close Button */}
            <TouchableOpacity
              style={[styles.button, styles.closeButton]}
              onPress={onClose}
            >
              <Text style={styles.buttonText}>
                {t('close')}
              </Text>
            </TouchableOpacity>


          </View>
        </View>
      </View>
    </Modal>
  );
};

export default AppointmentDetailsModal;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
    backgroundColor: COLORS.cardDark,
    borderRadius: 12,
    padding: 20,
  },
  doctorName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.textLight,
    marginBottom: 5,
  },
  specialty: {
    fontSize: 16,
    color: COLORS.textGray,
    marginBottom: 10,
  },
  rating: {
    fontSize: 16,
    color: COLORS.textGray,
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  infoLabel: {
    fontSize: 14,
    color: COLORS.textGray,
  },
  infoValue: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  buttonContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F43F5E', // Red for "Cancel"
  },
  closeButton: {
    backgroundColor: COLORS.accent,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
  },
});
