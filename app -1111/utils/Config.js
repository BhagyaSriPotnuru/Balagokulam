const config = {
  api: {
    localUrl: 'http://172.16.0.165:7221/',
    publicUrl: 'http://103.255.144.120:8888/',
    publicTestUrl: 'http://103.255.144.120:5353/',
    dedicatedTestUrl: 'http://103.255.144.115:7221/',
    registerUser: 'api/Account/RegisterUser',
    profileInfo: 'api/ProfileInfo/FetchProfileInfo',
    updateProfile: 'api/ProfileInfo/UpdateProfileInfo',
    sendotp: 'api/SMS/SendSMS',
    saveDeviceRegId: 'api/Device/SaveDeviceInfo',
    toggleNotification: 'api/Device/ToggleNotification',
    reftreshToken: '/Token',
    fetchNextRecords: 'api/Content/FetchScroll',
    searchRecords: 'api/Content/SearchKeyword',
    fetchContentListByDate: 'api/Content/FetchContentListByDate',
    deleteAccount: 'api/Account/UserAccountDelete',
    reactivateAccount: 'api/Account/ReactivateAccount',
    saveFeedback: 'api/FeedbackInfo/SaveUserFeedback',
    updateUserSubscription: 'api/SubscriptionsInfo/UserSubscriptionsUpdate',
    fetchUserSubscription: 'api/SubscriptionsInfo/FetchUserSubscriptions',
    fetchContentByTid: 'api/Content/FetchContentByTid',
    mobileLogin: 'api/Account/MobileLogin',
    fetchAppVersion: 'api/Content/FetchLatestAppVersion',
    isUpdateAvailable: 'api/Content/IsForceUpdateAvailable',
    fetchAppConstants: 'api/Content/FetchLatestAppInfo',
    fetchAllDates: 'api/Content/FetchAllDateRecords',
    fetchMobileCacheByMonth: 'api/Content/FetchMobileCacheMonthly',
    fetchCacheUpdate: 'api/Content/FetchMobileCacheUpdateAllMonth',
    fetchContentBytitleId: 'api/Content/FetchContentByProductionTid',
    fetchUserChannels: 'api/Channel/GetCurrentChannels',
    updateUserChannels: 'api/Channel/UpdateUserChannels',
    saveUserVersion: 'api/ProfileInfo/SaveUserVersion',
  },
}
export default function getServiceUrl(endpointKey) {
  return config.api.publicUrl + config.api[endpointKey]
}