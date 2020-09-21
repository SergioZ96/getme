/* Getme interface for new getmes that don't have _id's yet */
export interface Getme {
    topic: string;
    issue: string;
    view: string;
}

/* extension of Getme which holds the _id of getmes that were added to db */
export interface UserGetme extends Getme {
    _id: string;
}