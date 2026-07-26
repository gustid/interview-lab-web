import {QueryClient} from '@tanstack/react-query';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: true,
            staleTime: 1000 * 60 * 5, // 5 minutes
        },
        mutations: {
            retry: false,
        },
    }
});

export default queryClient;