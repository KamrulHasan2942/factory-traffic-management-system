'use client';

import { useEffect, useState } from 'react';
import {
  getJunction,
  getQueue,
} from '../lib/api';

type Signal =
  | 'RED'
  | 'YELLOW'
  | 'GREEN';

type Junction = {
  id: number;
  junctionId: string;
  name: string;
  mode: 'AUTOMATIC' | 'MANUAL';
  currentPhase: string;
  desiredPhase: string;
  desiredSignalState: Signal;
  northSignal: Signal;
  southSignal: Signal;
  eastSignal: Signal;
  westSignal: Signal;
  isActive: boolean;
  controllerStatus: string;
  sensorStatus: string;
  actualControllerState: string;
  emergencyDirection: string | null;
  emergencyVehicleId: string | null;
};

type Queues = {
  north: number;
  south: number;
  east: number;
  west: number;
};

export default function Home() {
  const [junction, setJunction] =
    useState<Junction | null>(null);

  const [queues, setQueues] =
    useState<Queues>({
      north: 0,
      south: 0,
      east: 0,
      west: 0,
    });

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState('');

  const loadDashboard = async () => {
    try {
      setError('');

      const junctionData =
        await getJunction('A');

      setJunction(junctionData);

      try {
        const queueData =
          await getQueue('A');

        setQueues({
          north:
            queueData.north ??
            queueData.NORTH ??
            0,

          south:
            queueData.south ??
            queueData.SOUTH ??
            0,

          east:
            queueData.east ??
            queueData.EAST ??
            0,

          west:
            queueData.west ??
            queueData.WEST ??
            0,
        });
      } catch {
        // Queue API failure should not
        // prevent junction status display.
      }
    } catch (err) {
      console.error(err);

      setError(
        'Unable to connect to the backend.',
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();

    const interval =
      setInterval(() => {
        loadDashboard();
      }, 3000);

    return () =>
      clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="rounded-xl bg-white p-8 shadow">
          <p className="text-lg font-semibold">
            Connecting to traffic backend...
          </p>
        </div>
      </main>
    );
  }

  if (error || !junction) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="rounded-xl bg-white p-8 text-center shadow">
          <h1 className="text-2xl font-bold text-red-600">
            Backend Connection Error
          </h1>

          <p className="mt-3 text-gray-600">
            {error}
          </p>

          <button
            onClick={loadDashboard}
            className="mt-5 rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white"
          >
            Retry
          </button>
        </div>
      </main>
    );
  }

  const signals = {
    north: junction.northSignal,
    south: junction.southSignal,
    east: junction.eastSignal,
    west: junction.westSignal,
  };

  const emergency =
    !!junction.emergencyVehicleId;

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-6 rounded-xl bg-white p-6 shadow">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">

            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Factory Traffic Management System
              </h1>

              <p className="mt-2 text-gray-600">
                {junction.name}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm font-medium">
                Mode:
              </span>

              <span
                className={`rounded-full px-4 py-2 text-sm font-bold ${
                  junction.mode ===
                  'AUTOMATIC'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-yellow-100 text-yellow-700'
                }`}
              >
                {junction.mode}
              </span>
            </div>

          </div>
        </div>

        {/* Status Cards */}
        <div className="mb-6 grid gap-4 md:grid-cols-4">

          <div className="rounded-xl bg-white p-5 shadow">
            <p className="text-sm text-gray-500">
              Current Phase
            </p>

            <p className="mt-2 text-xl font-bold">
              {junction.currentPhase}
            </p>
          </div>

          <div className="rounded-xl bg-white p-5 shadow">
            <p className="text-sm text-gray-500">
              Controller
            </p>

            <p
              className={`mt-2 text-xl font-bold ${
                junction.controllerStatus ===
                'ONLINE'
                  ? 'text-green-600'
                  : 'text-red-600'
              }`}
            >
              {junction.controllerStatus}
            </p>
          </div>

          <div className="rounded-xl bg-white p-5 shadow">
            <p className="text-sm text-gray-500">
              Sensor
            </p>

            <p
              className={`mt-2 text-xl font-bold ${
                junction.sensorStatus ===
                'ONLINE'
                  ? 'text-green-600'
                  : 'text-red-600'
              }`}
            >
              {junction.sensorStatus}
            </p>
          </div>

          <div className="rounded-xl bg-white p-5 shadow">
            <p className="text-sm text-gray-500">
              Emergency
            </p>

            <p
              className={`mt-2 text-xl font-bold ${
                emergency
                  ? 'text-red-600'
                  : 'text-green-600'
              }`}
            >
              {emergency
                ? 'ACTIVE'
                : 'NONE'}
            </p>
          </div>

        </div>

        {/* Traffic Signals */}
        <div className="mb-6 rounded-xl bg-white p-6 shadow">

          <h2 className="mb-5 text-2xl font-bold">
            Intersection Signals
          </h2>

          <div className="grid gap-6 md:grid-cols-4">

            {(
              Object.entries(
                signals,
              ) as [
                string,
                Signal,
              ][]
            ).map(
              ([direction, signal]) => (

                <div
                  key={direction}
                  className="rounded-xl border p-5 text-center"
                >

                  <h3 className="mb-4 text-lg font-bold">
                    {direction.toUpperCase()}
                  </h3>

                  <div className="mx-auto flex w-fit flex-col gap-2 rounded-full bg-gray-900 p-3">

                    <div
                      className={`h-8 w-8 rounded-full ${
                        signal === 'RED'
                          ? 'bg-red-500'
                          : 'bg-gray-600'
                      }`}
                    />

                    <div
                      className={`h-8 w-8 rounded-full ${
                        signal === 'YELLOW'
                          ? 'bg-yellow-400'
                          : 'bg-gray-600'
                      }`}
                    />

                    <div
                      className={`h-8 w-8 rounded-full ${
                        signal === 'GREEN'
                          ? 'bg-green-500'
                          : 'bg-gray-600'
                      }`}
                    />

                  </div>

                  <p className="mt-3 font-bold">
                    {signal}
                  </p>

                </div>
              ),
            )}

          </div>

        </div>

        {/* Queue Status */}
        <div className="mb-6 rounded-xl bg-white p-6 shadow">

          <h2 className="mb-5 text-2xl font-bold">
            Traffic Queues
          </h2>

          <div className="grid gap-4 md:grid-cols-4">

            {(
              Object.entries(
                queues,
              ) as [
                keyof Queues,
                number,
              ][]
            ).map(
              ([direction, count]) => (

                <div
                  key={direction}
                  className="rounded-xl border p-5"
                >

                  <div className="flex items-center justify-between">

                    <h3 className="font-bold">
                      {direction.toUpperCase()}
                    </h3>

                    <span className="rounded-full bg-blue-100 px-3 py-1 font-bold text-blue-700">
                      {count}
                    </span>

                  </div>

                </div>
              ),
            )}

          </div>

        </div>

        {/* Controller State */}
        <div className="mb-6 rounded-xl bg-white p-6 shadow">

          <h2 className="mb-4 text-2xl font-bold">
            Controller State
          </h2>

          <div className="grid gap-4 md:grid-cols-3">

            <div className="rounded-lg border p-4">
              <p className="text-sm text-gray-500">
                Desired Phase
              </p>

              <p className="mt-2 font-bold">
                {junction.desiredPhase}
              </p>
            </div>

            <div className="rounded-lg border p-4">
              <p className="text-sm text-gray-500">
                Desired Signal
              </p>

              <p className="mt-2 font-bold">
                {junction.desiredSignalState}
              </p>
            </div>

            <div className="rounded-lg border p-4">
              <p className="text-sm text-gray-500">
                Actual Controller State
              </p>

              <p className="mt-2 font-bold">
                {junction.actualControllerState}
              </p>
            </div>

          </div>

        </div>

        {/* Alerts */}
        <div className="mb-6 rounded-xl bg-white p-6 shadow">

          <h2 className="mb-4 text-2xl font-bold">
            Alerts
          </h2>

          {emergency && (
            <div className="mb-3 rounded-lg bg-red-100 p-4 font-semibold text-red-700">
              🚨 Emergency vehicle detected.
              Preemption required.
            </div>
          )}

          {junction.controllerStatus !==
            'ONLINE' && (
            <div className="mb-3 rounded-lg bg-red-100 p-4 font-semibold text-red-700">
              ⚠️ Controller status:{' '}
              {junction.controllerStatus}
            </div>
          )}

          {!emergency &&
            junction.controllerStatus ===
              'ONLINE' && (
              <div className="rounded-lg bg-green-100 p-4 font-semibold text-green-700">
                System operating normally.
              </div>
            )}

        </div>

        {/* Backend Connection */}
        <div className="rounded-xl bg-white p-6 shadow">

          <h2 className="text-2xl font-bold">
            Live Backend Connection
          </h2>

          <p className="mt-2 text-gray-600">
            Dashboard automatically refreshes
            every 3 seconds.
          </p>

          <div className="mt-4 rounded-lg bg-green-100 p-4 font-semibold text-green-700">
            ● Connected to NestJS backend
          </div>

        </div>

      </div>
    </main>
  );
}