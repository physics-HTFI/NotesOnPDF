/**
 * @example
 * [
 *   [ dir,
 *     [
 *       [ dir,
 *         [
 *           file,
 *           file,
 *         ],
 *       ],
 *       file,
 *       file,
 *     ],
 *   ],
 *   file,
 *   file,
 * ]
 */
export type Files = (string | [string, Files])[];
