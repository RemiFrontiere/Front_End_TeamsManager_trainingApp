export interface IUser {
    id: string,
    element: {
        avatar: string,
        firstname: string,
        lastname: string
    },
    position: string,
    teams: Array<string>
}

export interface ITeam {
    id: string,
    name: string,
    active: boolean,
    parent: string | null
}
