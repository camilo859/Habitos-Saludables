import React, { useState, useCallback, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Modal,
  TouchableWithoutFeedback,
  useWindowDimensions,
} from "react-native";
import { generateNotifications, formatRelativeTime } from "../utils/notifications";
import { habits } from "../utils/dummyData";

/**
 * NotificationBell — ícono de campanita con badge de conteo
 * y modal de lista de notificaciones.
 * Se usa en el header de HomeScreen.
 */
export default function NotificationBell() {
  const { width } = useWindowDimensions();
  const [visible, setVisible] = useState(false);
  const [readIds, setReadIds] = useState(new Set());

  const notifications = useMemo(() => generateNotifications(habits), []);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !readIds.has(n.id)).length,
    [notifications, readIds]
  );

  const markAllRead = useCallback(() => {
    setReadIds(new Set(notifications.map((n) => n.id)));
  }, [notifications]);

  const markOneRead = useCallback((id) => {
    setReadIds((prev) => new Set([...prev, id]));
  }, []);

  const renderNotif = useCallback(
    ({ item }) => {
      const isRead = readIds.has(item.id);
      return (
        <TouchableOpacity
          style={[styles.notifItem, isRead && styles.notifRead]}
          onPress={() => markOneRead(item.id)}
          activeOpacity={0.75}
        >
          {/* Dot de no leído */}
          {!isRead && <View style={[styles.unreadDot, { backgroundColor: item.color }]} />}

          <View style={[styles.notifIconWrap, { backgroundColor: item.color + "18" }]}>
            <Text style={styles.notifIcon}>{item.icon}</Text>
          </View>

          <View style={styles.notifBody}>
            <Text style={[styles.notifTitle, isRead && styles.notifTitleRead]}>
              {item.title}
            </Text>
            <Text style={styles.notifText} numberOfLines={2}>
              {item.body}
            </Text>
            <Text style={styles.notifTime}>
              {formatRelativeTime(item.time)}
            </Text>
          </View>
        </TouchableOpacity>
      );
    },
    [readIds, markOneRead]
  );

  return (
    <>
      {/* Campanita */}
      <TouchableOpacity
        style={styles.bellBtn}
        onPress={() => setVisible(true)}
        activeOpacity={0.75}
      >
        <Text style={styles.bellIcon}>🔔</Text>
        {unreadCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {unreadCount > 9 ? "9+" : unreadCount}
            </Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Modal de notificaciones */}
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setVisible(false)}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>

        <View style={[styles.panel, { width: Math.min(width - 32, 420) }]}>
          {/* Cabecera del panel */}
          <View style={styles.panelHeader}>
            <Text style={styles.panelTitle}>Notificaciones</Text>
            <View style={styles.panelHeaderRight}>
              {unreadCount > 0 && (
                <TouchableOpacity onPress={markAllRead} style={styles.markAllBtn}>
                  <Text style={styles.markAllText}>Marcar todo leído</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity onPress={() => setVisible(false)}>
                <Text style={styles.closeBtn}>✕</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Lista */}
          <FlatList
            data={notifications}
            keyExtractor={(item) => item.id}
            renderItem={renderNotif}
            style={styles.list}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No hay notificaciones.</Text>
            }
          />
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  bellBtn: {
    position: "relative",
    padding: 4,
    marginRight: 4,
  },
  bellIcon: {
    fontSize: 22,
  },
  badge: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "#EF4444",
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 3,
    borderWidth: 1.5,
    borderColor: "#2563EB",
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "800",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  panel: {
    position: "absolute",
    top: 70,
    right: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    overflow: "hidden",
    maxHeight: 480,
    elevation: 12,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 16,
  },
  panelHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  panelTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#1E293B",
  },
  panelHeaderRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  markAllBtn: {
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  markAllText: {
    fontSize: 11,
    color: "#2563EB",
    fontWeight: "700",
  },
  closeBtn: {
    fontSize: 16,
    color: "#94A3B8",
    fontWeight: "700",
  },
  list: {
    maxHeight: 400,
  },
  notifItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 14,
    backgroundColor: "#FAFAFA",
    position: "relative",
  },
  notifRead: {
    backgroundColor: "#FFFFFF",
    opacity: 0.7,
  },
  unreadDot: {
    position: "absolute",
    top: 18,
    left: 6,
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  notifIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    marginLeft: 8,
  },
  notifIcon: { fontSize: 20 },
  notifBody: { flex: 1 },
  notifTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 3,
  },
  notifTitleRead: {
    color: "#64748B",
    fontWeight: "500",
  },
  notifText: {
    fontSize: 12,
    color: "#64748B",
    lineHeight: 17,
    marginBottom: 4,
  },
  notifTime: {
    fontSize: 10,
    color: "#94A3B8",
  },
  separator: {
    height: 1,
    backgroundColor: "#F1F5F9",
    marginLeft: 62,
  },
  emptyText: {
    textAlign: "center",
    padding: 24,
    color: "#94A3B8",
    fontSize: 14,
  },
});