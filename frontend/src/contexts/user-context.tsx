import { Dispatch, ReactNode, SetStateAction, createContext, useContext, useState } from 'react';

export interface IUser {
    id: number;
    email: string;
    motivational_message: string;
    emoji: string;
    streak: number;
    best_streak: number;
    total_days_readed: number;
    percentage_of_days_readed: number;
    total_days_readed_on_current_month: number;
    days_readed: Date[] | undefined
}

interface IUserContext {
    user: IUser
    setUser: Dispatch<SetStateAction<IUser>>;
}

const UserContext = createContext({} as IUserContext);


export function UserProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<IUser>({} as IUser);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
}

export const useUser = () => useContext(UserContext);

