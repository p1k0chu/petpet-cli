{
  description = "A very basic flake";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs?ref=nixos-unstable";
  };

  outputs =
    { self, nixpkgs }:
    let
      system = "x86_64-linux";
      pkgs = import nixpkgs { inherit system; };
    in
    {
      devShells.${system}.default = pkgs.mkShellNoCC {
        packages = with pkgs; [
          bun
          libuuid
          prettier
          vscode-langservers-extracted
        ];
        APPEND_LIBRARY_PATH = with pkgs; "${lib.makeLibraryPath [
          libGL
          libuuid
        ]}";
        shellHook = ''
          export LD_LIBRARY_PATH="$APPEND_LIBRARY_PATH:$LD_LIBRARY_PATH"
        '';
      };
    };
}
