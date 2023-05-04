// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Tunnel } from '@microsoft/dev-tunnels-contracts';
import { Stream, Trace } from '@microsoft/dev-tunnels-ssh';
import { CancellationToken, Disposable } from 'vscode-jsonrpc';
import { RetryingTunnelConnectionEventArgs } from './retryingTunnelConnectionEventArgs';

/**
 * Tunnel session.
 */
export interface TunnelSession {
    /**
     * Gets the trace source.
     */
    trace: Trace;

    /**
     * Gets tunnel access scope for this tunnel session.
     */
    tunnelAccessScope: string;

    /**
     * Validates tunnel access token if it's present. Returns the token.
     */
    validateAccessToken(): string | undefined;

    /**
     *  Notifies about a connection retry, giving the client a chance to delay or cancel it.
     */
    onRetrying(event: RetryingTunnelConnectionEventArgs): void;

    /**
     * Validate the tunnel and get data needed to connect to it, if the tunnel is provided;
     * otherwise, ensure that there is already sufficient data to connect to a tunnel.
     * @param tunnel Tunnel to use for the connection.
     *     Tunnel object to get the connection data if defined.
     *     Undefined if the connection data is already known.
     */
    onConnectingToTunnel(tunnel?: Tunnel): Promise<void>;

    /**
     * Connect to the tunnel session by running the provided {@link action}.
     */
    connectSession(action: () => Promise<void>): Promise<void>;

    /**
     * Connect to the tunnel session with the tunnel connector.
     * @param tunnel Tunnel to use for the connection.
     *     Undefined if the connection information is already known and the tunnel is not needed.
     *     Tunnel object to get the connection information from that tunnel.
     */
    connectTunnelSession(tunnel?: Tunnel): Promise<void>;

    /**
     * Creates a stream to the tunnel for the tunnel session.
     */
    createSessionStream(
        cancellation: CancellationToken,
    ): Promise<{ stream: Stream, protocol: string }>;

    /**
     * Configures the tunnel session with the given stream.
     */
    configureSession(
        stream: Stream,
        protocol: string,
        isReconnect: boolean,
        cancellation: CancellationToken,
    ): Promise<void>;

    /**
     * Closes the tunnel session.
     */
    closeSession(error?: Error): Promise<void>;

    /**
     * Refreshes the tunnel access token. This may be useful when the tunnel service responds with 401 Unauthorized.
     */
    refreshTunnelAccessToken(cancellation: CancellationToken): Promise<boolean>;
}
