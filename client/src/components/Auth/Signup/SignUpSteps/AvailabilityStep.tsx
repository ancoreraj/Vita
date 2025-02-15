import React, { useState } from 'react';
import { FieldValues, useForm, Controller } from 'react-hook-form';
import {
  Stack,
  Typography,
  Divider,
  Box,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import {
  MuiStyledButton as StyledButton,
  StyledReactSelect,
} from 'components/common';
import { TimeSlotsOptions } from 'data';
import { isObjectEmpty } from 'utils/helper';

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const AvailabilityStep: React.FC<{
  onBack: (step: number, formData: FieldValues) => void;
  onContinue: (step: number, formData: FieldValues) => void;
  hydrate: FieldValues;
  loading: boolean;
}> = (props) => {
  const [isTouched, setIsTouched] = useState(false);
  const {
    handleSubmit,
    control,
    getValues,
    setValue,
    clearErrors,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: props.hydrate,
  });

  const form = watch();

  const onBackClick = () => {
    props.onBack(2, getValues());
  };

  const onSumbit = (formData: FieldValues) => {
    if (!isTouched) setIsTouched(true);

    if (isObjectEmpty(formData.slots)) {
      return;
    }

    props.onContinue(2, formData);
  };

  const onDefaultClick = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.currentTarget.checked) return;

    setValue('dayChecked[Sat]', true);
    setValue('slots[Sat]', [
      {
        label: '11:00 - 12:00',
        value: {
          start: new Date(2021, 0, 1, 11, 0),
          end: new Date(2021, 0, 1, 12, 0),
        },
      },
      {
        label: '12:00 - 13:00',
        value: {
          start: new Date(2021, 0, 1, 12, 0),
          end: new Date(2021, 0, 1, 13, 0),
        },
      },
    ]);

    setValue('dayChecked[Sun]', true);
    setValue('slots[Sun]', [
      {
        label: '11:00 - 12:00',
        value: {
          start: new Date(2021, 0, 1, 11, 0),
          end: new Date(2021, 0, 1, 12, 0),
        },
      },
      {
        label: '12:00 - 13:00',
        value: {
          start: new Date(2021, 0, 1, 12, 0),
          end: new Date(2021, 0, 1, 13, 0),
        },
      },
    ]);
  };

  const isError = isObjectEmpty(form?.slots);

  return (
    <Stack
      spacing={3}
      mt={2}
      component="form"
      onSubmit={handleSubmit(onSumbit)}>
      <Typography variant="h4">Tell us about your Availability</Typography>
      <Stack justifyContent="space-between" direction="row" alignItems="center">
        <Typography variant="body2" mb={1}>
          Set your weekly hours
        </Typography>
        <FormControlLabel
          control={<Checkbox onChange={onDefaultClick} />}
          label="Use Default"
        />
      </Stack>
      <Stack>
        {days.map((day, index) => (
          <Box key={index}>
            <Divider />
            <Stack position="relative" spacing={2} my={3} direction="row">
              <Stack
                direction={{ xs: 'column', md: 'row' }}
                spacing={2}
                alignItems={{ xs: 'flex-start', md: 'center' }}>
                <Controller
                  name={`dayChecked[${day}]`}
                  control={control}
                  render={({ field: { onChange, ...props } }) => (
                    <FormControlLabel
                      control={
                        <Checkbox
                          {...props}
                          onChange={(e) => {
                            if (!e.currentTarget.checked) {
                              setValue(`slots[${day}]`, null);
                              clearErrors(`slots[${day}]`);
                            }

                            onChange(e);
                          }}
                          checked={form?.dayChecked?.[day] || false}
                        />
                      }
                      label={day}
                    />
                  )}
                />
                {!form?.dayChecked?.[day] ? (
                  <Typography variant="body2" color="textSecondary">
                    Unavailable
                  </Typography>
                ) : (
                  <Controller
                    name={`slots[${day}]`}
                    control={control}
                    rules={{ required: 'Please select at least one time slot' }}
                    render={({ field }) => (
                      <StyledReactSelect
                        closeMenuOnSelect={false}
                        menuPlacement="top"
                        {...field}
                        placeholder="Select your time slots"
                        isMulti
                        classNamePrefix="select"
                        options={TimeSlotsOptions}
                      />
                    )}
                  />
                )}
                {errors?.slots?.[day] && (
                  <Typography variant="caption" color="error.main">
                    {errors.slots[day].message}
                  </Typography>
                )}
              </Stack>
            </Stack>
            <Divider />
          </Box>
        ))}
      </Stack>
      {isTouched && isError && (
        <Typography variant="caption" color="error">
          Please select at least one time slot to continue.
        </Typography>
      )}
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <StyledButton onClick={onBackClick}>Back</StyledButton>
        <StyledButton
          disabled={props.loading}
          type="submit"
          variant="contained"
          sx={{ flex: 0.3 }}>
          Finish
        </StyledButton>
      </Stack>
    </Stack>
  );
};

export default AvailabilityStep;
