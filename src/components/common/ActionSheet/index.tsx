import i18next from 'i18next';
import React, { RefObject } from 'react';
import { Text, View } from 'react-native';
import { Modalize } from 'react-native-modalize';
import { Portal } from 'react-native-portalize';

import Touchable from '../Touchable';
import styles from './styles';

interface Option {
  id: number;
  label: string;
  onPress: () => void;
  destructive?: boolean;
}

interface Props {
  modalRef: RefObject<Modalize>;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  options: Option[];
}

function ActionSheet({ modalRef, onClose, title, subtitle, options }: Props) {
  const handleClose = () => {
    modalRef?.current?.close();
    onClose?.();
  };

  const handleItemPress = (option: Option) => {
    option?.onPress();
    handleClose();
  };

  return (
    <Portal>
      <Modalize
        ref={modalRef}
        withHandle={false}
        adjustToContentHeight
        modalStyle={styles.modal}>
        <View>
          <View style={styles.topContainer}>
            {(title || subtitle) && (
              <View style={styles.titleContainer}>
                {title && <Text style={styles.title}>{title}</Text>}
                {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
              </View>
            )}
            {options?.map((option, index) => (
              <Touchable
                key={option.id}
                onPress={() => handleItemPress(option)}
                style={[styles.item, index > 0 && styles.itemBorder]}>
                <Text
                  style={[
                    styles.itemText,
                    option.destructive && styles.destructiveText,
                  ]}>
                  {option.label}
                </Text>
              </Touchable>
            ))}
          </View>
          <Touchable
            onPress={handleClose}
            style={[styles.item, styles.cancelContainer]}>
            <Text style={[styles.itemText, styles.cancelText]}>
              {i18next.t('common.cancel')}
            </Text>
          </Touchable>
        </View>
      </Modalize>
    </Portal>
  );
}

export default ActionSheet;
