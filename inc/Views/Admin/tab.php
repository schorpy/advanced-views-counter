<?php
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

?>
<div class="popzy-settings">
    <div id="popzy-metabox-content">
        <div class="popzy-container">
            <div class="popzy-container">
                <div class="grid grid-cols-12">
                    <div class="col-span-2">
                        <div role="tab" aria-controls="tab-trigger" aria-selected="true" class="cursor-pointer flex flex-row items-center h-12 px-4 text-gray-400 bg-gray-100 hover:bg-sky-500/50 hover:text-white popzy-option-navigation popzy-current-option-navigation">
                            <span class="flex items-center justify-center">

                            </span>
                            <span class="ml-3 font-semibold">Trigger</span>
                        </div>
                        <div role="tab" aria-controls="tab-target" aria-selected="false" class="cursor-pointer flex flex-row items-center h-12 px-4 text-gray-400 bg-gray-100 hover:bg-sky-500/50 hover:text-white popzy-option-navigation">
                            <span class="flex items-center justify-center">

                            </span>
                            <span class="ml-3 text-md">Targeting</span>
                        </div>
                    </div>
                    <div class="col-span-10 border-l-4 border-sky-500/50 bg-grid-gray-100 bg-gray-50 option-tab-content">
                        <div class="border border-black/5 px-6 py-4">
                            <!-- tab 1 -->
                            <div role="tabpanel" id="tab-trigger">
                                <div class="text-lg font-semibold pb-4 mb-4 border-b border-gray-200">Trigger</div>
                                <div class="grid grid-cols-5 gap-4 py-4 popzy-option-container-">
                                    <div class="font-medium text-gray-600 pt-2 flex justify-between">
                                        <label for="field_option_title">Show Title</label>

                                    </div>
                                    <div class="col-span-4">
                                        <div class="flex">
                                            <select id="select_title" name="popzy_option[title]" style="width: 100%;">
                                                <option value="">— Select an Option —</option>
                                                <option value="1" <?php echo $data['show_title'] == '1' ? 'selected' : '' ?>>Yes</option>
                                                <option value="0" <?php echo $data['show_title'] == '0' ? 'selected' : '' ?>>No</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div class="grid grid-cols-5 gap-4 py-4 popzy-option-container-">
                                    <div class="font-medium text-gray-600 pt-2 flex justify-between">
                                        <label for="field_option_trigger_delay">Delay</label>

                                    </div>
                                    <div class="col-span-4">
                                        <div class="flex">

                                            <input type="text" value="<?php echo esc_html($data['delay']) ?>" id="field_option_trigger_delay" name="popzy_trigger[delay]" class="border border-gray-200 py-2 px-3 text-grey-darkest w-full" placeholder="1000ms">
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <!-- tab 2 -->
                            <div role="tabpanel" id="tab-target">
                                <div class="text-lg font-semibold pb-4 mb-4 border-b border-gray-200">Targeting</div>
                                <div class="grid grid-cols-5 gap-4 py-4 popzy-option-container-">
                                    <div class="font-medium text-gray-600 pt-2 flex justify-between">
                                        <label for="select_target">Select Target</label>

                                    </div>
                                    <div class="col-span-4">
                                        <div class="flex">
                                            <select id="select_target" name="popzy_target[select]" style="width: 100%;">
                                                <option value="">— Select an Option —</option>
                                                <?php if (!empty($data['options'])): ?>
                                                    <?php foreach ($data['options'] as $option): ?>
                                                        <?php if (!empty($option['group']) && is_array($option['group'])): ?>
                                                            <optgroup label="<?php echo esc_attr($option['text']); ?>">
                                                                <?php foreach ($option['group'] as $item): ?>
                                                                    <option value="<?php echo esc_attr($item['type'] . '_' . $item['id']); ?>"
                                                                        <?php echo (isset($data['selected']) && in_array($item['type'] . '_' . $item['id'], (array) $data['selected'], true)) ? 'selected' : ''; ?>>
                                                                        <?php echo esc_html($item['text']); ?>
                                                                    </option>
                                                                <?php endforeach; ?>
                                                            </optgroup>
                                                        <?php else: ?>
                                                            <option value="<?php echo esc_attr($option['id']); ?>"
                                                                <?php echo (isset($data['selected']) && in_array($option['id'], (array) $data['selected'], true)) ? 'selected' : ''; ?>>
                                                                <?php echo esc_html($option['text']); ?>
                                                            </option>
                                                        <?php endif; ?>
                                                    <?php endforeach; ?>
                                                <?php endif; ?>



                                            </select>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>