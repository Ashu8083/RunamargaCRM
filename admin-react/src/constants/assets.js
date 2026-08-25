export const APP_LOGO = '/logo/favicon_logo.png'
    
export const DEFAULT_PROFILE_IMAGES = Object.freeze({
    male: '/default/male_profile.png',
    female: '/default/female_profile.png',
})

export const getDefaultProfileImage = (gender) => {
    return String(gender || '').toLowerCase() === 'female'
        ? DEFAULT_PROFILE_IMAGES.female
        : DEFAULT_PROFILE_IMAGES.male
}
