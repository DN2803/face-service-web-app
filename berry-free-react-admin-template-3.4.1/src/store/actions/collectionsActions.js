export const fetchCollectionsRequest = () => ({ type: 'FETCH_COLLECTIONS_REQUEST' });
export const fetchCollectionsSuccess = (collections) => ({ type: 'FETCH_COLLECTIONS_SUCCESS', payload: collections });
export const fetchCollectionsFailure = () => ({ type: 'FETCH_COLLECTIONS_FAILURE' });
export const addCollection = (collection) => ({
    type: 'ADD_COLLECTION',
    payload: collection,
});

export const removeCollection = (id) => ({
    type: 'REMOVE_COLLECTION',
    payload: { id },
});

export const updateCollection = (id, data) => ({
    type: 'UPDATE_COLLECTION',
    payload: { id, data },
});