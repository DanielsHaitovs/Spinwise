export type UserWhereQuery = {
    id?: { in: number[] };
    email?: { in: string[] };
    firstName?: { in: string[] };
    lastName?: { in: string[] };
};

export type UserWhereOrQuery = {
    OR: UserWhereQuery[];
};
