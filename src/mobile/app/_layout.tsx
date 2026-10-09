import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { ApiError } from '../src/shared/api/http-client';

export default function RootLayout() {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        retry: (failureCount, error) =>
          error instanceof ApiError && error.status >= 400
            ? false
            : failureCount < 2,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          contentStyle: { backgroundColor: '#f6f2ea' },
          headerStyle: { backgroundColor: '#f6f2ea' },
          headerTintColor: '#17242b',
          headerTitleStyle: { fontWeight: '700' },
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="task/[id]" options={{ title: 'Task detail' }} />
      </Stack>
    </QueryClientProvider>
  );
}
