'use client';

import {
  QueryClient,
  QueryClientProvider,
  defaultShouldDehydrateQuery,
  isServer,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import * as React from 'react';
import { ReactQueryStreamedHydration } from '@tanstack/react-query-next-experimental';

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
      },
      dehydrate: {
        // include pending queries in dehydration
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === 'pending',
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
  if (isServer) {
    return makeQueryClient();
  } else {
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}

export function Providers(props: { children: React.ReactNode }) {
  const queryClient = getQueryClient();
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryStreamedHydration>
        {props.children}
      </ReactQueryStreamedHydration>
      {/* {isClient && <ReactQueryDevtools initialIsOpen={false} />} */}
    </QueryClientProvider>
  );
}

// 'use client';

// import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// // import dynamic from 'next/dynamic';
// // import { useEffect, useState } from 'react';
// // import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// // const ReactQueryDevtools = dynamic(
// //   () =>
// //     import('@tanstack/react-query-devtools').then(
// //       (mod) => mod.ReactQueryDevtools
// //     ),
// //   { ssr: false }
// // );

// const queryClient = new QueryClient();

// export const Providers = ({ children }: { children: React.ReactNode }) => {
//   // const [isClient, setIsClient] = useState(false);

//   // useEffect(() => {
//   //   setIsClient(true);
//   // }, []);
//   return (
//     <QueryClientProvider client={queryClient}>
//       {children}
//       {/* <ReactQueryDevtools initialIsOpen={false} /> */}
//     </QueryClientProvider>
//   );
// };
