const tegb = {
    ces: {
        dashboard: {
            profileDetails: {
                heading: "Detaily Profilu",
                editProfileButton: "Upravit profil",
                username: "Jméno:",
                surname: "Příjmení:",
                email: "Email:",
                phone: "Telefon:",
                age: "Věk:",
                updatedMessage: "Profile updated successfully!",
            },
            accountsDetail: {
                heading: "Účty",
                newAccountButton: "Přidat účet",
                errorMessage: "Unexpected error occured. Please try again later.",
                accounts: {
                    accountNumber: "Číslo účtu",
                    balance: "Zůstatek",
                    accountType: "Typ účtu",
                },
            },
            header: {
                title: "TEG#B Dashboard",
                logoutButton: "Odhlásit se",
            },
            leftMenu: {
                home: "Domů",
                accounts: "Účty",
                transactions: "Transakce",
                support: "Podpora",
            },
        },
        profileEdit: {
            heading: "UDetaily Profilu",
            cancelButton: "Zrušit úpravy",
            saveButton: "Uložit změny",
        },
    },
    eng: {
        dashboard: {
            profileDetails: {
                heading: "Profile Details",
                editProfileButton: "Edit Profile",
                username: "Name:",
                surname: "Surname:",
                email: "Email:",
                phone: "Phone:",
                age: "Age:",
                updatedMessage: "Profile updated successfully!",
            },
            accountsDetail: {
                heading: "Accounts",
                newAccountButton: "Add Account",
                errorMessage: "Unexpected error occurred. Please try again later.",
                accounts: {
                    accountNumber: "Account Number",
                    balance: "Balance",
                    accountType: "Account Type",
                },
            },
            header: {
                title: "TEG#B Dashboard",
                logoutButton: "Log Out",
            },
            leftMenu: {
                home: "Home",
                accounts: "Accounts",
                transactions: "Transactions",
                support: "Support",
            },
        },
        profileEdit: {
            heading: "Profile Details",
            cancelButton: "Cancel Changes",
            saveButton: "Save Changes",
        },
    },
};

export type SupportedLanguages = keyof typeof tegb;
export const dictionary = tegb[(process.env.APP_LANG as SupportedLanguages) || "ces"];
export default dictionary;
export const getDictionary = (lang: SupportedLanguages) => tegb[lang] || tegb.ces;
export type Dictionary = typeof dictionary;