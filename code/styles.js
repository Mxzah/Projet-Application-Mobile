import { StyleSheet } from "react-native";

export const geAnnoncestStyles = (theme) =>
    StyleSheet.create({
        grid: {
            paddingHorizontal: 8,
            paddingBottom: 16,
        },
        row: {
            gap: 8,
            paddingVertical: 6,
            justifyContent: 'flex-start',
        },
        card: {
            flex: 1,
            flexBasis: '48%',
            maxWidth: '48%',
            backgroundColor: theme.card,
            borderRadius: 8,
            overflow: "hidden",
            borderWidth: StyleSheet.hairlineWidth,
            borderColor: theme.border,
        },
        image: {
            width: "100%",
            aspectRatio: 1,
            backgroundColor: theme.imageBackground,
        },
        meta: {
            paddingHorizontal: 8,
            paddingVertical: 8,
        },
        price: {
            fontWeight: "700",
            fontSize: 14,
            marginBottom: 2,
            color: theme.text,
        },
        title: {
            fontSize: 12,
            color: theme.text,
        },
        place: {
            fontSize: 11,
            color: theme.textLight,
            marginTop: 2,
        },
        sectionHeader: {
            paddingHorizontal: 12,
            paddingVertical: 8,
        },
        sectionTitle: {
            fontWeight: "700",
            fontSize: 16,
            color: theme.text,
        },
        filtersBanner: {
            marginHorizontal: 12,
            marginBottom: 8,
            padding: 12,
            borderRadius: 8,
            borderWidth: StyleSheet.hairlineWidth,
            borderColor: theme.border,
            backgroundColor: theme.card,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
        },
        filtersText: {
            fontWeight: "600",
            color: theme.text,
        },
        empty: {
            textAlign: "center",
            color: theme.textLight,
            paddingVertical: 40,
        },
        dialogOverlay: {
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.35)",
            justifyContent: "center",
            padding: 16,
        },
        dialogCard: {
            backgroundColor: theme.card,
            borderRadius: 16,
            padding: 16,
            maxHeight: "90%",
        },
        dialogImage: {
            width: "100%",
            height: 200,
            borderRadius: 12,
            marginBottom: 12,
        },
        dialogTitle: {
            fontSize: 20,
            fontWeight: "700",
            color: theme.text,
        },
        dialogDescription: {
            marginTop: 6,
            color: theme.textLight,
            lineHeight: 20,
        },
        dialogRow: {
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 10,
        },
        dialogLabel: {
            color: theme.textLight,
            fontWeight: "600",
        },
        dialogValue: {
            color: theme.text,
            fontWeight: "700",
        },
        profileLink: {
            marginTop: 12,
            paddingVertical: 8,
            alignItems: "center",
        },
        profileLinkText: {
            color: theme.primary,
            fontWeight: "600",
            fontSize: 14,
        },
        dialogForm: {
            marginTop: 16,
            gap: 12,
        },
        dialogFormTitle: {
            fontSize: 16,
            fontWeight: "700",
            color: theme.text,
            marginBottom: 8,
        },
        dialogInput: {
            borderWidth: 1,
            borderColor: theme.border,
            color: theme.text,
            borderRadius: 10,
            paddingHorizontal: 12,
            paddingVertical: 10,
            marginBottom: 12,
        },
        offerButton: {
            backgroundColor: theme.primary,
            paddingVertical: 12,
            alignItems: "center",
            marginTop: 12,
            marginBottom: 6,
            borderRadius: 10,
        },
        offerButtonLabel: {
            color: theme.submitButtonText,
            fontWeight: "700",
        },
        sectionHeader: {
            paddingHorizontal: 12,
            paddingVertical: 8,
            backgroundColor: theme.background,
        },
        sectionTitle: {
            fontWeight: "700",
            fontSize: 16,
            color: theme.text,
        },
    });

export const getHeaderStyles = (theme) =>
    StyleSheet.create({
        container: {
            paddingTop: 8,
            paddingHorizontal: 12,
            paddingBottom: 8,
            backgroundColor: theme.card,
        },
        topRow: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 8,
        },
        title: {
            fontSize: 26,
            fontWeight: "bold",
            color: theme.text,
        },
        rightIcons: {
            flexDirection: "row",
            alignItems: "center",
        },
        iconButton: {
            marginLeft: 12,
        },
        tabsRow: {
            flexDirection: "row",
            alignItems: "center",
        },
        tab: {
            paddingVertical: 6,
            paddingHorizontal: 14,
            borderRadius: 999,
            marginRight: 8,
            backgroundColor: theme.card,
        },
        tabText: {
            fontSize: 14,
            fontWeight: "600",
            color: theme.text,
        },
        activeTab: {
            backgroundColor: theme.primaryLight,
        },
        activeTabText: {
            color: theme.primary,
        },
    });


export const getCreateAnnonceStyles = (theme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.background,
        },
        scrollContent: {
            padding: 20,
        },
        formCard: {
            backgroundColor: theme.card,
            borderRadius: 16,
            padding: 20,
            shadowColor: '#000',
            shadowOpacity: 0.05,
            shadowRadius: 12,
            shadowOffset: { width: 0, height: 4 },
            elevation: 3,
            borderWidth: StyleSheet.hairlineWidth,
            borderColor: theme.border,
        },
        title: {
            fontSize: 22,
            fontWeight: '700',
            marginBottom: 4,
            color: theme.text,
        },
        subtitle: {
            fontSize: 16,
            color: theme.textLight,
            marginBottom: 20,
        },
        field: {
            marginBottom: 16,

        },
        label: {
            fontSize: 14,
            color: theme.text,
            marginBottom: 6,
            fontWeight: '600',
        },
        input: {
            width: '100%',
            backgroundColor: theme.inputBackground,
            borderWidth: 1,
            borderColor: theme.border,
            borderRadius: 10,
            paddingHorizontal: 14,
            paddingVertical: 12,
            fontSize: 15,
            color: theme.text,
        },
        textarea: {
            minHeight: 100,
            textAlignVertical: 'top',
        },
        pickerWrapper: {
            borderWidth: 1,
            borderColor: theme.border,
            borderRadius: 10,
            overflow: 'hidden',
            backgroundColor: theme.inputBackground,
        },
        submitButton: {
            marginTop: 6,
            backgroundColor: theme.primary,
            paddingVertical: 14,
            borderRadius: 12,
            alignItems: 'center',
        },
        submitLabel: {
            color: theme.submitButtonText,
            fontWeight: '700',
            fontSize: 16,
            letterSpacing: 0.3,
        },
        preview: {
            width: '100%',
            height: 200,
            borderRadius: 12,
            marginBottom: 12,
            backgroundColor: theme.border,
        },
        previewPlaceholder: {
            justifyContent: 'center',
            alignItems: 'center',
        },
        previewPlaceholderText: {
            color: theme.textLight,
            fontWeight: '600',
        },
        cameraButton: {
            backgroundColor: theme.text,
            paddingVertical: 10,
            borderRadius: 10,
            alignItems: 'center',
            marginBottom: 6,
        },
        cameraButtonLabel: {
            color: theme.buttonText,
            fontWeight: '600',
        },
        helperText: {
            fontSize: 12,
            color: theme.textLight,
        },
    });


export const getProgrammesStyles = (theme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.background,
        },
        listHeader: {
            paddingHorizontal: 12,
            paddingTop: 8,
        },
        title: {
            fontSize: 24,
            fontWeight: "700",
            marginBottom: 8,
            color: theme.text,
        },
        listContent: {
            paddingHorizontal: 12,
            paddingBottom: 16,
        },
        programCard: {
            backgroundColor: theme.card,
            borderRadius: 10,
            borderWidth: StyleSheet.hairlineWidth,
            borderColor: theme.border,
            padding: 12,
            marginBottom: 10,
        },
        programHeaderRow: {
            flexDirection: "row",
            alignItems: "center",
        },
        checkWrap: {
            width: 28,
            alignItems: "center",
            justifyContent: "center",
        },
        uncheckedCircle: {
            width: 22,
            height: 22,
            borderRadius: 11,
            borderWidth: 2,
            borderColor: theme.border,
            backgroundColor: "transparent",
        },
        programName: {
            fontSize: 16,
            fontWeight: "700",
            color: theme.text,
            flex: 1,
            paddingRight: 8,
        },
        sessionBadge: {
            fontSize: 12,
            fontWeight: "700",
            color: theme.primary,
            backgroundColor: theme.primaryLight,
            paddingHorizontal: 8,
            paddingVertical: 2,
            borderRadius: 999,
            alignSelf: "flex-start",
        },
        programDesc: {
            marginTop: 6,
            fontSize: 13,
            color: theme.textLight,
            lineHeight: 18,
        },
        coursList: {
            marginTop: 10,
            paddingTop: 10,
            borderTopWidth: StyleSheet.hairlineWidth,
            borderTopColor: theme.border,
        },
        coursRow: {
            flexDirection: "row",
            alignItems: "flex-start",
            paddingVertical: 8,
            borderBottomWidth: StyleSheet.hairlineWidth,
            borderBottomColor: theme.border,
        },
        coursCode: {
            fontSize: 12,
            fontWeight: "700",
            color: theme.primary,
            backgroundColor: theme.primaryLight,
            paddingHorizontal: 8,
            paddingVertical: 2,
            borderRadius: 999,
            marginRight: 10,
            alignSelf: "flex-start",
        },
        coursName: {
            fontSize: 14,
            fontWeight: "700",
            color: theme.text,
        },
        coursDesc: {
            marginTop: 2,
            fontSize: 12,
            color: theme.textLight,
            lineHeight: 16,
        },
    });




export const getProfileStyles = (theme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.background,
        },

        scrollContent: {
            paddingBottom: 30,
        },

        header: {
            backgroundColor: theme.card,
            paddingVertical: 30,
            paddingHorizontal: 20,
            alignItems: "center",
            borderBottomLeftRadius: 25,
            borderBottomRightRadius: 25,
            shadowColor: "#000",
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 5,
        },

        themeToggleButton: {
            alignSelf: "flex-end",
            marginBottom: 8,
            paddingHorizontal: 10,
            paddingVertical: 6,
            borderRadius: 999,
            backgroundColor: theme.background,
        },

        themeToggleText: {
            color: theme.text,
            fontSize: 12,
            fontWeight: "600",
        },

        avatar: {
            width: 85,
            height: 85,
            borderRadius: 50,
            marginBottom: 12,
        },

        name: {
            fontSize: 24,
            fontWeight: "bold",
            color: theme.text,
        },

        email: {
            fontSize: 14,
            color: theme.textLight,
            marginTop: 4,
        },

        btnAnnonces: {
            marginTop: 14,
            paddingHorizontal: 14,
            paddingVertical: 8,
            borderRadius: 999,
            backgroundColor: theme.primary,
        },

        btnAnnoncesText: {
            color: theme.submitButtonText,
            fontWeight: "700",
            fontSize: 14,
        },

        infoSection: {
            backgroundColor: theme.card,
            padding: 16,
            marginTop: 15,
            marginHorizontal: 18,
            borderRadius: 12,
            shadowColor: "#000",
            shadowOpacity: 0.05,
            shadowRadius: 5,
            elevation: 2,
        },

        infoLabel: {
            fontSize: 14,
            fontWeight: "600",
            color: theme.textLight,
            marginBottom: 4,
        },

        infoValue: {
            fontSize: 16,
            color: theme.text,
        },

        sectionTitle: {
            fontSize: 18,
            fontWeight: "800",
            marginTop: 20,
            marginBottom: 8,
            marginHorizontal: 18,
            color: theme.text,
        },

        annonceCard: {
            flexDirection: "row",
            backgroundColor: theme.card,
            marginHorizontal: 18,
            marginVertical: 8,
            borderRadius: 14,
            overflow: "hidden",
            shadowColor: "#000",
            shadowOpacity: 0.06,
            shadowRadius: 6,
            elevation: 2,
        },

        annonceImage: {
            width: 90,
            height: 90,
            marginRight: 12,
        },

        annonceContent: {
            flex: 1,
            paddingRight: 8,
        },

        annonceTitre: {
            fontSize: 16,
            fontWeight: "700",
            marginTop: 8,
            marginRight: 8,
            color: theme.text,
        },

        annonceLieu: {
            fontSize: 13,
            color: theme.textLight,
            marginTop: 2,
        },

        annoncePrix: {
            fontSize: 15,
            fontWeight: "800",
            marginTop: 6,
            color: theme.text,
        },

        annonceDates: {
            fontSize: 12,
            color: theme.textLight,
            marginTop: 4,
            marginBottom: 8,
        },

        emptyBox: {
            backgroundColor: theme.card,
            marginHorizontal: 18,
            padding: 16,
            borderRadius: 12,
        },

        emptyText: {
            color: theme.textLight,
        },

        avisCard: {
            backgroundColor: theme.card,
            marginHorizontal: 18,
            marginVertical: 6,
            padding: 14,
            borderRadius: 12,
            shadowColor: "#000",
            shadowOpacity: 0.05,
            shadowRadius: 4,
            elevation: 2,
        },

        avisStars: {
            fontSize: 16,
            fontWeight: "800",
            marginBottom: 6,
            color: theme.text,
        },

        avisCommentaire: {
            fontSize: 15,
            color: theme.text,
        },

        avisCommentaireMuted: {
            fontSize: 15,
            color: theme.textLight,
            fontStyle: "italic",
        },

        avisMeta: {
            marginTop: 8,
            fontSize: 12,
            color: theme.primary,
        },
        dialogOverlay: {
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.35)",
            justifyContent: "center",
            padding: 16,
        },
        dialogCard: {
            backgroundColor: theme.card,
            borderRadius: 16,
            padding: 16,
            maxHeight: "90%",
        },
        dialogImage: {
            width: "100%",
            height: 200,
            borderRadius: 12,
            marginBottom: 12,
        },
        dialogTitle: {
            fontSize: 20,
            fontWeight: "700",
            color: theme.text,
        },
        dialogDescription: {
            marginTop: 6,
            color: theme.textLight,
            lineHeight: 20,
        },
        dialogRow: {
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 10,
        },
        dialogLabel: {
            color: theme.textLight,
            fontWeight: "600",
        },
        dialogValue: {
            color: theme.text,
            fontWeight: "700",
        },
        profileLink: {
            marginTop: 12,
            paddingVertical: 8,
            alignItems: "center",
        },
        profileLinkText: {
            color: theme.primary,
            fontWeight: "600",
            fontSize: 14,
        },
        dialogForm: {
            marginTop: 16,
            gap: 12,
        },
        dialogFormTitle: {
            fontSize: 16,
            fontWeight: "700",
            color: theme.text,
            marginBottom: 8,
        },
        dialogInput: {
            borderWidth: 1,
            borderColor: theme.border,
            color: theme.text,
            borderRadius: 10,
            paddingHorizontal: 12,
            paddingVertical: 10,
            marginBottom: 12,
        },
        offerButton: {
            backgroundColor: theme.primary,
            paddingVertical: 12,
            alignItems: "center",
            marginTop: 12,
            marginBottom: 6,
            borderRadius: 10,
        },
        offerButtonLabel: {
            color: theme.submitButtonText,
            fontWeight: "700",
        },
        propositionCard: {
            backgroundColor: theme.card,
            marginHorizontal: 18,
            marginVertical: 6,
            padding: 14,
            borderRadius: 12,
            shadowColor: "#000",
            shadowOpacity: 0.05,
            shadowRadius: 4,
            elevation: 2,
        },
        propositionTitre: {
            fontSize: 15,
            fontWeight: "700",
            color: theme.text,
            marginBottom: 4,
        },
        propositionLigne: {
            fontSize: 14,
            color: theme.text,
        },
        propositionMeta: {
            marginTop: 6,
            fontSize: 12,
            color: theme.textLight,
        },
        propositionActions: {
            flexDirection: "row",
            justifyContent: "flex-end",
            marginTop: 10,
            gap: 8,
        },
        btnAccept: {
            backgroundColor: "#16a34a",
            paddingVertical: 8,
            paddingHorizontal: 12,
            borderRadius: 8,
        },
        btnAcceptText: {
            color: "#fff",
            fontWeight: "700",
        },
        btnRefuse: {
            backgroundColor: "#dc2626",
            paddingVertical: 8,
            paddingHorizontal: 12,
            borderRadius: 8,
        },
        btnRefuseText: {
            color: "#fff",
            fontWeight: "700",
        },
        logoutWrapper: {
            marginTop: 30,
            marginBottom: 40,
            alignItems: "center",
        },

        logoutButton: {
            backgroundColor: theme.primary,
            paddingVertical: 14,
            paddingHorizontal: 26,
            borderRadius: 12,
            shadowColor: "#000",
            shadowOpacity: 0.15,
            shadowRadius: 6,
            elevation: 3,
        },

        logoutText: {
            color: theme.buttonText,
            fontWeight: "700",
            fontSize: 16,
            letterSpacing: 0.3,
        },

    });
