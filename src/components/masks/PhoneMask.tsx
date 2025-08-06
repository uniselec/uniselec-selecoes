import { forwardRef } from 'react';
import { IMaskInput } from 'react-imask';

const PhoneMask = forwardRef<any, any>(function PhoneMask(props, ref) {
  const { onChange, name, ...other } = props;

  return (
    <IMaskInput
      {...other}
      mask={[
        {
          mask: '(00) 0000-0000', // fixo: 10 dígitos
        },
        {
          mask: '(00) 00000-0000', // celular: 11 dígitos
        },
      ]}
      dispatch={(appended, dynamicMasked) => {
        const number = (dynamicMasked.value + appended).replace(/\D/g, '');
        return number.length > 10
          ? dynamicMasked.compiledMasks[1] // celular
          : dynamicMasked.compiledMasks[0]; // fixo
      }}
      definitions={{
        '0': /[0-9]/,
      }}
      inputRef={ref}
      onAccept={(value: any) => {
        onChange({
          target: {
            name,
            value,
          },
        } as React.ChangeEvent<HTMLInputElement>);
      }}
      overwrite
    />
  );
});


export default PhoneMask;