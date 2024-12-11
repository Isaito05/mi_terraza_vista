declare namespace google {
    namespace accounts {
      namespace id {
        function initialize(config: { client_id: string; callback: (response: any) => void }): void;
        function prompt(): void;
        function renderButton(
          container: HTMLElement,
          options: {
            theme?: 'outline' | 'filled_blue' | 'filled_black';
            size?: 'small' | 'medium' | 'large';
            text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin';
            shape?: 'rectangular' | 'pill' | 'circle' | 'square';
            logo_alignment?: 'left' | 'center';
            width?: string;
          }
        ): void;
      }
    }
  }
  