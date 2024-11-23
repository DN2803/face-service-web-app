export const fetchCollectionsRequest = () => ({ type: 'FETCH_COLLECTIONS_REQUEST' });
export const fetchCollectionsSuccess = (collections) => ({ type: 'FETCH_COLLECTIONS_SUCCESS', payload: collections });
export const fetchCollectionsFailure = () => ({ type: 'FETCH_COLLECTIONS_FAILURE' });
